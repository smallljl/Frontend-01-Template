/*
 * @Author: your name
 * @Date: 2020-08-01 10:55:35
 * @LastEditTime: 2020-08-05 11:26:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Frontend-01-Template\week17\component\webpack.config.js
 */
module.exports = {
  entry:"./main.js",
  module:{
    rules:[
      {
        test:/\.js$/,
        use: {
         loader:"babel-loader", 
         options:{
          presets:["@babel/preset-env"],
          plugins:[["@babel/plugin-transform-react-jsx",{
            pragma:"createElement"
          }]]
         }
        },
      },
      {
        test:/\.view$/,
        use:{
          loader:require.resolve("./myloader.js")
        }
      },
      {
        test:/\.css$/,
        use:{
          loader:require.resolve("./cssloader.js")
        }
      }
    ]
  },
  mode:"development",
  optimization:{
    minimize:false
  }
}