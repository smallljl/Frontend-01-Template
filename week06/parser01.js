/*
 * @Author: your name
 * @Date: 2020-05-17 15:47:56
 * @LastEditTime: 2020-05-17 17:43:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit e
 * @FilePath: \Frontend-01-Template\week06\parser01.js
 */ 

let currentToken = null;
let currentAttribute = null;
function emit(token){
    if(token.type !== "text")
        console.log(token);
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
    if(c.match(/^[\t\n\f ]$/)){
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
        return afterAttributeName(c);  // 进去 理论报错
    } else if(c === "="){
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}

function afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    } else if(c === "/"){
        return selfClosingStartTag;
    } else if(c === "="){
        return beforeAttributeValue
    } else if(c === ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c === EOF){

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
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

function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    } else if(c === "/"){
        return selfClosingStartTag;
    } else if(c === ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c === EOF) {

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
}