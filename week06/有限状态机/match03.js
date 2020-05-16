/*
 *
 *找abcdef
 *
 */ 
function match(string){
    let foundA = false;
    let foundB = false;
    let foundC = false;
    let foundD = false;
    for(let c of string){
        if(c === "a"){
            foundA = true;
        } else if(foundA && c === "b"){
            foundB = true;
        } else if(foundB && c === "c"){
           foundC = true;
        } else if(foundC && foundD === "d"){
           foundD = true;
        } else {
            foundD = false;
            foundB = false;
            foundA = false;
            foundC = false;
        }
    }
    return false;
}
console.log(match("abca"))