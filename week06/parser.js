let currentToken = null;
let currentAttribute = null;
let stack = [{type:"document",children:[]}];
let currentTextNode = null; // 处理文本节点
/**
 * @description:构造DOM树 
 * @param {type} 
 * @return: 
 */
function emit(token){
    if(token.type === "text"){
        console.log(token);
    }
    let top = stack[stack.length-1];
    if(token.type === "startTag"){
        let element = {
            type:"element",
            children:[],
            attributes:[]
        };
        element.tagName = token.tagName;
        for(let p in token){
            // 挂载Token的属性
            if(p !== "type" && p !== "tagName"){
                element.attributes.push({
                    name:p,
                    value:token[p]
                });
            }
        }
        top.children.push(element);
        element.parent = top;
        if(!token.isSelfClosing){  // 不是自封闭
            stack.push(element);
        }
        currentTextNode = null;
    } else if(token.type === "endTag"){
        if(top.tagName !== token.tagName){
            throw new Error("Tag start end doesn't match!");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    } else if(token.type === "text"){
        if(currentTextNode === null){
            currentTextNode = {
                type:"text",
                content:""
            };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

const EOF = Symbol("EOF");

function data(c){
    if(c === "<"){
        return tagOpen;
    } else if(c === EOF){
        emit({
            type:"EOF"
        });
        return;
    } else {
        // 标签 > 完后
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
        return;
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

    } else {

    }
}

function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){   // \f 匹配换页字符
        return beforeAttributeName;   // 遇到空格 进去  beforeAttributeName
    } else if(c === "/"){
        return selfClosingStartTag;
    } else if(c.match(/^[A-Z]$/)){
        currentToken.tagName += c.toLowerCase();
        return tagName;
    } else if(c === ">"){
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF){
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


function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    } else if(c === ">" || c === "/" || c === EOF){
        return afterAttributeName(c);  // 进去 
    } else if(c === "="){
        
    } else {
        currentAttribute = {
            name:"",
            value:""
        }
        return attributeName(c);
    }
}

function afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    } else if(c === "/"){
        return selfClosingStartTag;
    } else if(c === "="){
      
    } else if(c === ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c === EOF){

    } else {
        currentAttribute = {
            name:"",
            value:""
        }
        return attributeName(c)
    }
}

function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF){
        return beforeAttributeValue;
    } else if(c === "\""){
        return doubleQuotedAttributeValue;
    } else if(c === "\'"){
        return singleQuotedAttributeValue;
    } else if(c === ">"){

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
        return doubleQuotedAttributeValue
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
        return singleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;  // 当前属性应用到当前的token上  保存了最后一个
        return beforeAttributeName;
    } else if(c === "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if(c === ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c === "\u0000"){

    } else if(c === "'" || c === "\"" || c === "<" || c === "=" || c === "`"){

    } else if(c === EOF){

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue
    }
}

function selfClosingStartTag(c){
    if(c === ">"){
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if(c === "EOF"){

    } else {

    }
}

module.exports.parseHTML = function parseHTML(html){
    let state = data;
    for(let c of html){
        state = state(c);
    }
    state = state(EOF);
    console.log(stack);
}