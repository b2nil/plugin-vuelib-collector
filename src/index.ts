import type { IPluginContext } from '@tarojs/service'

interface IOptions {
  [key: string]: Array<string>
}

module.exports = function (
  ctx: IPluginContext,
  options: IOptions
) {
  if (process.env.TARO_ENV === 'h5') return

  const framework = ctx.initialConfig.framework
  if (
    framework !== ctx.helper.FRAMEWORK_MAP.VUE3 &&
    framework !== ctx.helper.FRAMEWORK_MAP.VUE
  ) return

  const collectVueLibTags = (node) => {
    const { componentConfig } = require('@tarojs/mini-runner/dist/template/component.js')
    const condition = framework === 'vue'
      ? node.type === 1 /* ELEMENT, always true for Vue 2.0 */
      : node.type === 1 /* NodeTypes.ELEMENT */ && node.tagType === 1 /*ElementTypes.COMPONENT*/

    if (condition) {
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
        if (framework === 'vue') {
          options.compilerOptions.modules = [
            ...options.compilerOptions.modules,
            { preTransformNode: collectVueLibTags }
          ]
        } else {
          options.compilerOptions.mode = "module"
          options.compilerOptions.optimizeImports = true
          options.compilerOptions.nodeTransforms = [
            ...options.compilerOptions.nodeTransforms,
            collectVueLibTags
          ]
        }

        return options
      })
  })
}

