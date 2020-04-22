/*
写一个正则表达式 匹配所有 Number 直接量
写一个 UTF-8 Encoding 的函数
输入测试 输出"\u6D4B\u8BD5"
写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
输入"aaa",'aaa'用正则匹配出来
完成一篇本周的学习总结*/

/**
 * @return {boolean}
 */
function Num(num){
    return /(\d+\.\d*)|(\d*)/.test(num);
}

function Encoding(){

}

function matchStrig(str){
    let reg = /(\')[^\']*\1|(\")[^"]\2/g;
    let res = [];
    let item = "";
    while((item = reg.exec(str)) !== null){
        res.push(item[0]);
    }
    return res;
}

console.log(matchStrig("'132' '3213'"));