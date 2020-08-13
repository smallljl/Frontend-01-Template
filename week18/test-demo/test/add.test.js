let mod = require("../src/add.js")
const test  = require("ava");

test("foo",t=>{
  if(mod.add(3,4) === 7)
    t.pass();
})