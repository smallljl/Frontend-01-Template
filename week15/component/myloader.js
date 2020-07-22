let parser  = require("./parser");

module.exports = function(source,map){
    console.log(parser.parseHTML(source));
    console.log("my loader is running!!!!!!!!!!!!!!!!!\n",this.resourcePath);
    return "";
}