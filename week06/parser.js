const EOF = Symbol("EOF");  //EOF: End Of File

let currentToken = null;
let currentAttribute = null;

function emit(token){
    if(token.type !== "text"){
        console.log(token);
    }
}

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
    } else if(c.match(/^[a-zA-Z]$/)){  // 匹配字母  ["c", index: 0, input: "c"]
        currentToken = {
            type:"startTag",
            tagName: ""
        };
        return tagName(c);
    } else {
        emit({
            type:"text",
            content:c
        });
        return;
    }
}



function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName; // 是空格   <html 
    } else if(c === "/"){
        return selfClosingStartTag;
    } else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c; // .toLowerCase()
        return tagName;
    } else if(c === ">"){
        emit(currentToken);
        return data;
    } else {
        return tagName;  // 返回自己
    }
}

// 开始处理属性
function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){  
        return beforeAttributeName;
    } else if(c === ">" || c === "/" || c === EOF){
        return afterAttributeName(c);
    } else if(c === "="){
        
    } else {
        currentAttribute = {
            name: "",
            value: ""
        };
        return attributeName(c);
    }
}

function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF){
        return afterAttributeName(c);
    } else if(c === "="){
        return beforeAttributeValue;
    } else if(c === "\u0000"){

    } else if(c === "\"" || c === "'" || c ==="<"){

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c===EOF){
        return beforeAttributeValue;
    } else if(c === "\""){
        return doubleQuotedAttributeValue;
    } else if(c === "\'"){
        return singleQuotedAttributeValue;
    } else if(c === ">"){
        return data;
    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c){
    if(c === "\""){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c === "\u0000"){

    } else if(c === EOF){

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c){
    if(c === "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c === "\u0000"){

    } else if(c === EOF){

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
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
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
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


// 单标签结束
function selfClosingStartTag(c){
    if(c === ">"){
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if(c === "EOF"){

    } else {

    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:"endTag",
            tagName:""
        }
        return tagName(c);
    } else if(c === ">"){

    } else if(c === EOF){

    }
}

function afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    } else if(c === "/"){
        return selfClosingStartTag;
    } else if(c === "="){
        return beforeAttributeValue;
    } else if(c === ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c === EOF){

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        };
        return attributeName(c);
    }
}

/**
 * 返回一颗DOM树
 */
module.exports.parseHTML = function parseHTML(html){
    let state = data;
    for(let c of html){
        console.log(c);
        state = state(c);
    }
    state = state(EOF);
}