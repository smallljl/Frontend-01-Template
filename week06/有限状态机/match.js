/*
 * 找到一个字符串a
 */ 
function match(string){
    for(let c of string){
        if(c === "a")
            return true;
    }
    return false;
}

match("I am groot");