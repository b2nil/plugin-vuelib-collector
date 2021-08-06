# plugin-vuelib-collector
> 用于收集第三方 Vue 组件库所使用到的原生小程序标签的 Taro 插件

> 支持 Vue2 和 Vue3

## 安装
```bash
yarn add -D plugin-vuelib-collector

```

## 用法

例如组件 `HanziView` 用到了两个小程序原生标签: `view`, `canvas`。

```ts
// config/index.js
{
  plugins: [
    ['plugin-vuelib-collector', {
      'HanziView': ['canvas', 'view']
    }]
  ],
}

```
