const rules = require("./webpack.rules")
const webpack = require("webpack")
const getReplacements = require("./app-info")
const replacements = getReplacements()
const CopyPlugin = require("copy-webpack-plugin")
const PermissionsOutputPlugin = require("webpack-permissions-plugin")

rules.push(
  {
    test: /\.(scss|sass)$/,
    exclude: /node_modules/,
    loaders: [
      {
        loader: "style-loader",
      },
      {
        loader: "css-loader",
      },
      {
        loader: "sass-loader", // the sass-loader converts the sass into css, the css-loader puts that css into the JS, the style-loader puts the javascript into the DOM.
      },
    ],
  },
  {
    test: /\.css$/i, // regex to select only .css files
    use: [
      {
        loader: "style-loader",
      },
      {
        loader: "css-loader",
      },
    ],
  },
  // Needed for font-awesome
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: "url-loader?limit=10000000&mimetype=application/font-woff",
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: "file-loader",
  },
  {
    test: /\.(png|jpg|gif)$/,
    // loader: "file-loader",
    loader: "url-loader?limit=1000000",
  },
  {
    test: /\.jsx$/,
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/env", "@babel/react"],
          plugins: ["@babel/plugin-transform-runtime"],
        },
      },
    ],
  }
)

module.exports = {
  module: {
    rules,
  },
  node: {
    __dirname: false,
  },
  resolve: {
    extensions: [".js", ".jsx", ".css", ".scss", ".json"],
    modules: ["node_modules"],
  },
  plugins: [
    new webpack.DefinePlugin(
      Object.assign({}, replacements, {
        __PROCESS_KIND__: JSON.stringify("renderer"),
      })
    ),
    new CopyPlugin([
      { from: "node_modules/dugite/git", to: "../git" },
    ]),
    new PermissionsOutputPlugin({
      buildFolders: [
        ".webpack/git/bin",
        ".webpack/git/libexec/git-core",
        ".webpack/git/libexec/git-core/mergetools",
      ],
      buildFiles: [
        {
          path: ".webpack/git/bin/git",
          fileMode: "755"
        }
      ]
    }),
  ],
}
