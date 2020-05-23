/*
 * abababx  homework
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
        return start;
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
    if(c === "a")
        return foundA2;
    else 
        return start(c);
}

function foundA2(c){
    if(c === "b"){
        return foundB2;
    } else {
        return start(c);
    }
}

function foundA2(c){
    if(c === "b"){
        return foundB2;
    }else{
        return start(c)
    }
}

function foundB2(c){
    if(c === "x"){
        return end;
    }else{
        return foundB(c);   // 返回到找到ab的
    } 
}

console.log(match("abababx","I am a abababababx"));
let a = "aaaa";
a.indexOf("d");
function match(a,b){
   
}