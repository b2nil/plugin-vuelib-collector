// @ts-ignore
import { componentConfig } from '@tarojs/mini-runner/dist/template/component.js'

import type { IPluginContext } from '@tarojs/service'
import type { NodeTransform } from '@vue/compiler-core'

interface IOptions {
  [key: string]: Array<string>
}

export default function (
  ctx: IPluginContext,
  options: IOptions
) {
  if (process.env.TARO_ENV === 'h5') return
  if (ctx.initialConfig.framework !== 'vue3') return

  const collectVueLibTags: NodeTransform = (node) => {
    if (
      node.type === 1 /* NodeTypes.ELEMENT */ &&
      node.tagType === 1 /*ElementTypes.COMPONENT*/
    ) {
      const compName = ctx.helper.pascalCase(node.tag)
      if (options[compName]) {
        for (const tag of options[compName]) {
          if (!componentConfig.includes.has(tag)) {
            componentConfig.includes.add(tag)
          }
        }
      }
    }
  }

  ctx.modifyWebpackChain(({ chain }) => {
    chain.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vueLoader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          ...options.compilerOptions,
          mode: "module",
          optimizeImports: true,
          nodeTransforms: [
            collectVueLibTags,
            ...options.compilerOptions.nodeTransforms
          ]
        }
        return options
      })
  })
}

