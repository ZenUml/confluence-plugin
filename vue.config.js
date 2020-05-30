var HtmlWebpackPlugin = require('html-webpack-plugin')
var productType = process.env.PRODUCT_TYPE

module.exports = {
  assetsDir: productType,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js' // Full version with template compiler
      }
    }
  },
  devServer: {
    compress: true,  // This reduces the app.js from 4.8MB to 1.2MB
    before: function (app) {
      app.get(/installed/, function (req, res) {
        res.status(200).send(`OK`);
      })
      app.get(/uninstalled/, function (req, res) {
        res.status(200).send(`OK`);
      })
    }
  },
  chainWebpack: config => {
    config
      .plugin('viewer-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./${productType}/view.html`,
        template: './public/view.html',
        inject: true,
        product_type: productType
      }])
    config
      .plugin('editor-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./${productType}/edit.html`,
        template: './public/edit.html',
        inject: true,
        product_type: productType
      }])

    config
      .plugin('copy')
      .tap(args => {
        // constructor parameter for 'CopyWebpackPlugin'
        args[0][0].ignore.push('view.html')
        args[0][0].ignore.push('edit.html')
        args[0][0].to = `${productType}/`
        return args
      })
  }
};