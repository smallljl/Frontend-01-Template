/**
 * @description: 匹配abcabx
 * @param {type} 
 * @return {type} 
 */
function match(string){
  let state = start;
  for(let c of string){
    state = state(c);
  }
  return state === end;
}

function start(c){
  if(c === "a"){
    return foundA;
  } else {
    return start;
  }
}

function end(c){
  return end;
}

function foundA(c){
  if(c === "b"){
    return foundB;
  } else {
    return start(c);  // 本状态代理到start
  }
}

function foundB(c){
  if(c === "c"){
    return foundC;
  } else {
    return start(c);
  }
}


function foundC(c){
  if(c === "a"){
    return foundA2;
  } else {
    return start(c);
  }
}

function foundA2(c){
  if(c === "b"){
    return foundB2;
  } else {
    return start(c)
  }
}

function foundB2(c){
  if(c === "x"){  // 如果找到x 说明前两个字符是 ab
    return end;
  } else {
    return foundB(c);
  }
}


console.log(match("abcabcabcabx"))