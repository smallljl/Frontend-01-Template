const EOF = Symbol("EOF");  //EOF: End Of File

let currentToken = null;

function emit(token){
    console.log(token);
}

function data(c){
    if(c === "<"){
        return tagOpen;
    } else if(c === EOF){
        emit({
            type:"EOF"
        });
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
    } else if(c === ">"){
        return data;
    } else if(c === "="){
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}

// 单标签结束
function selfClosingStartTag(c){
    if(c === ">"){
        currentToken.isSelfClosing = true;
        return data;
    } else if(c === "EOF"){

    } else {

    }
}

function endTagOpen(){

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