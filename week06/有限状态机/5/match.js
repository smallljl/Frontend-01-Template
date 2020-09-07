/**
 * @description: 匹配aabcde
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
    return end;
  } else {
    return start(c);
  }
}



console.log(match("aabc"))