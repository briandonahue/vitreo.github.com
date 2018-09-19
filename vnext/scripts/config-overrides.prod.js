const path = require('path');
const RewriteImportPlugin = require("less-plugin-rewrite-import");
const ROOT_DIR = path.join(__dirname, '../');
const NODE_MODULES_DIR = path.join(__dirname, '../node_modules');

module.exports = function(config) {
  // Add the LESS loader second-to-last
  // (last one must remain as the "file-loader")
  let loaderList = config.module.rules[1].oneOf;
  loaderList.splice(loaderList.length - 1, 0, {
    test: /\.(?:le|c)ss$/,
    use: ["style-loader", "css-loader", 
      {
        loader: "less-loader",
        options: {
          paths: [ROOT_DIR, NODE_MODULES_DIR], 
          plugins: [ new RewriteImportPlugin({
            paths: {
              '../../theme.config': path.join(__dirname, '../vitreo-theme/theme.config')
            }
          })

          ]
        }
      }
    ],
  },
  {
    test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
    use: 'file-loader?name=[name].[ext]?[hash]'
  },

  // the following 3 rules handle font extraction
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
  },
  
  {
    test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader'
  },
  {
  test: /\.otf(\?.*)?$/,
  use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf'
  },
  { 
    test: /\.(png|jpg|gif|woff|svg|eot|ttf|woff2)$/,
    loader: 'url-loader?limit=1024&name=[name]-[hash:8].[ext]!image-webpack-loader',
  });
};
