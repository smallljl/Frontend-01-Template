/*
 *
 *找aabc
 *
 */ 
function match(string){
    let state = start;
    for(let c of string){
        console.log(c)  // a
        state = state(c);
    }
    return state === end;
}

function start(c){
    if(c === "a")
        return foundA;  //返回状态a
    else
        return start(c);
}

function end(c){
    return end;
}

function foundA(c){
    if(c === "b")
        return foundB;
    else
        return start(c);  // a   返回foundA的状态
}

function foundB(c){
    if(c === "c")
        return end;
    else 
        return start(c);
}
console.log(match("aaabc"));