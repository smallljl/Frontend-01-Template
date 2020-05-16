const EOF = Symbol("EOF");  //EOF: End Of File

function data(c){
    if(c === "<"){
        return tagOpen;
    } else if(c === EOF){
        return;
    } else {
        return data
    }
}

/**
 * 返回一颗DOM树
 */
module.exports.parseHTML = function parseHTML(html){
    console.log(html);
    // let state = data;
    // for(let c of html){
    //     state = state(c);
    // }
    // state = state(EOF);
}