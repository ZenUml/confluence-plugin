var HtmlWebpackPlugin = require('html-webpack-plugin')

var version = process.env.VERSION || 'latest'
module.exports = {
  assetsDir: version,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js' // Full version with template compiler
      }
    }
  },

  chainWebpack: config => {
    config
      .plugin('viewer-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./${version}/view.html`,
        template: './public/view.html',
        inject: true
      }])
    config
      .plugin('v-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./${version}/v.html`,
        template: './public/v.html',
        inject: true
      }])
    config
      .plugin('editor-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./${version}/edit.html`,
        template: './public/edit.html',
        inject: true
      }])

    config
      .plugin('copy')
      .tap(args => {
        // constructor parameter for 'CopyWebpackPlugin'
        args[0][0].ignore.push('view.html')
        args[0][0].ignore.push('edit.html')
        args[0][0].to = `${version}/`
        return args
      })
  }
};