# Run locally
$ yarn serve

Open local pages at:
1. index.html - http://localhost:8080
1. edit.html - http://localhost:8080/latest/edit.html
1. view.html - http://localhost:8080/latest/view.html

> `latest` is defined in `vue.config.js`. When `process.env.VERSION` is not provided
`latest` is used.

# Release
The release is done through Gitlab.

# Design decisions

1. Both 'view.html' and 'edit.html' will share the same JS file.

    Pros:
    1. It simplifies the building system. By default, 
    `vue-cli-service serve` treats only `main.js` as the entry.
    Though we can change it by providing an `entry` parameter, 
    it means we need to assign different `entry` JS files to
    different html files.
    2. It allows us to include the current code in the viewing 
    page. This can be useful for users to quick view the code.
    This is NOT a feature we are going to support soon.
    
    Cons:
    1. It means we are including editor's JS into the bundle. It
    would increase the size by a large extent. This makes `view.html`
    and `edit.html` almost the same.
    
    There is another factor to be considered - the template compiler.
    We could include the template compiler, and use different template
    in `view.html` and `edit.html`. This also has its own pros and cons.
    
    Pros:
    1. It is a clearer separation of intentions, as the difference of 
    viewing and editing is located in the html files. It is at the end
    of the day why we have two html files.
    
    Cons:
    1. It increases the JS file by about 25Kb (10Kb zipped) for both
    viewing and editing.

# Output
## edit.html, edit.js
These two files are used to insert or update the sequence diagram. 
  
## view.html, view.js
These two files are used to render the diagram in the confluence page.

# Questions

1. There is not webpack config, how to configure the output?
    
    By default the, `vue-cli-service` create a Zero-config project structure. 
    Webpack's configure can be added to vue.config.js.
    ````
    module.exports = {
      configureWebpack: config => {
        // ...
      }
    };
    ````
2. How is the `index.html` generated?

    The `index.html` is generated by the `html-webpack-plugin`. This is
    configured in `./node_modules/@vue/cli-service/lib/config/app.js`.
    The template is (by convention) in the `./public` folder.
    
3. How to generate multiple html files?

    To generate more than one html files, declare the plugin more than once.
    In `vue.config.js`:
    ````
    // Basic configuration
    var HtmlWebpackPlugin = require('html-webpack-plugin')
    
    module.exports = {
      configureWebpack: {
        plugins: [
          new HtmlWebpackPlugin({
            filename: 'app.html',
            template: './public/app-template.html',
            inject: true
          })
        ]
      }};
    ````
    Or
    ````
    // Chaining
    chainWebpack: config => {
    config
      .plugin('app-html')
      .use(HtmlWebpackPlugin, [{
        filename: 'app.html',
        template: './public/app-template.html',
        inject: true
      }])
    ````
    With the above configuration, `app.html` will be generated in `dist` folder. However, you
    will see that `app-template.html` is also copied into that folder. To prevent that from
    happening, we need to modify the options of the `copy` plugin.
    
    First, run `vue inspect > inspect.js` to check what is the current configuration of the 
    `copy` plugin.
    ````
     /* config.plugin('copy') */
    new CopyWebpackPlugin(
      [
        {
          from: '/the/aboslute/path/confluence-plugin/public',
          to: '/the/aboslute/path/confluence-plugin/dist',
          ignore: [
            'index.html',
            '.DS_Store'
          ]
        }
      ]
    ),
    ````
    Now, let's update the configure with chaining API.
    ````
    config
      .plugin('copy')   // get the plugin if it exists
      .tap(args => {
        // constructor parameter for 'CopyWebpackPlugin'
        args[0][0].ignore.push('app-template.html')
        return args
      })
    ````