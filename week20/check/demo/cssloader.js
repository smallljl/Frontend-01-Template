/*
 * @Author: your name
 * @Date: 2020-08-28 09:40:18
 * @LastEditTime: 2020-09-02 09:26:27
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \Frontend-01-Template\week20\check\demo\cssloader.js
 */
let css = require("css");

module.exports = function (source, map) {
  let stylesheet = css.parse(source);

  let name = this.resourcePath.match(/([^\\]+).css$/)[1];

  for(let rule of stylesheet.stylesheet.rules){
   

    rule.selectors = rule.selectors.map(selector =>
      selector.match(new RegExp(`^.${name}`)) ? selector :
      `.${name} ${selector}`)
  } 
  
  return `
    let style = document.createElement("style");
    style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))}
    document.documentElement.appendChild(style);  
  `
}