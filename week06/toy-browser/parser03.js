let currentToken = null;
let currentAttribute = null;

let stack = [{type:"document",chiildren:[]}];

function emit(token){
  if(token.type !== "text")
    console.log(token);
}

const EOF = Symbol("EOF");  //EOF: End Of File

function data(c){
  if(c === "<"){
    return tagOpen;
  } else if(c === EOF){
    emit({
        type:"EOF"
    });
    return;
  } else {
    emit({
        type:"text",
        content:c
    });
    return data;
  }
}

function tagOpen(c){
  if(c === "/"){
    return endTagOpen;
  } else if(c.match(/^[a-zA-Z]$/)){
    currentToken = {
        type:"startTag",
        tagName:""
    }
    return tagName(c);
  } else {
    return ;
  }
}

function endTagOpen(c){
  if(c.match(/^[a-zA-Z]$/)){
    currentToken = {
      type: "endTag",
      tagName:""
    }
    return tagName;
  } else if(c === ">"){

  } else if(c === EOF){

  } else {

  }
}

function tagName(c){
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName;
  } else if(c === "/"){
    return selfClosingStartTag;
  } else if(c.match(/^[a-zA-Z]$/)){
    return tagName;
  } else if(c === ">"){
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c){
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName;
  } else if(c === ">" || c=== "/" || c === EOF){
    return afterAttributeName(c);
  } else if(c === "="){
  
  } else {
    currentAttribute = {
        name:"",
        value:""
    }
    return attributeName(c);
  }
}

function attributeName(c){
  if(c.match(/^[/\t\n\f /]$/) || c === "/" || c === ">" || c === EOF){
    return afterAttributeName(c);
  } else if(c === "="){
    return beforeAttributeValue;
  } else if(c === "\u0000"){

  } else if(c === "\"" || c === "'" || c === "<"){
    
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(){

}

function afterQuotedAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/)){
    return beforeAttributeName;
  } else if(c === "/"){
    return selfClosingStartTag;
  } else if(c === ">"){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if(c === EOF){
    
  } else {
    currentAttribute.value +=c;
    return doubleQuoredAttributeValue;
  }
}

function beforeAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF){
    return beforeAttributeValue;
  } else if(c === "\""){
    return doubleQuoredAttributeValue;
  } else if(c === "'"){
    return singleQuotedAttributeValue;
  } else if(c === ">"){
   
  } else {
    return UnquotedAttributeValue(c);
  }
}

function doubleQuoredAttributeValue(c){

}

function singleQuotedAttributeValue(c){

}

function UnquotedAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/)){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if(c === "/"){
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if(c === ">"){
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if(c === "\u0000"){

  } else if(c === "\"" || c === "'" || c === "<" || c === "=" || c === "`"){

  } else if(c === EOF){

  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

function selfClosingStartTag(c){
  if(c === ">"){
    currentToken.isSelfClosing = true;
    return data;
  } else if(c === "EOF"){

  } else {

  }
}


module.exports.parseHTML =  function parseHTML(html){
  let state = data;
  for(let c of html){
    state = state(c);
  }
  state = state(EOF); 
}


