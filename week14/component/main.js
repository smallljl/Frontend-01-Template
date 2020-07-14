import "./foo";

// React版的创建
function createElement(Cls,attributes,...children){

  let o = new Cls({
    timer:{}
  });
  for(let name in attributes){
    o.setAttribute(name,attributes[name]);  // 不会触发set class
    // o[name] = attributes[name];
  }
  
  for(let child of children){
    // o.children.push(child);
    o.appendChild(child);
  }

  return o;
}

/*
function create(Cls,attributes){
  let o = new Cls;
  for(let name in attributes){
    o[name] = attributes[name];
  }
  debugger
  return o;
}
*/

class Parent {
  constructor(config){
    this.children = [];
    this.root = document.createElement("div");
  }
  set class1(a){  // property
    // class 属性会进来
    console.log("Parent::class",a)
  }
  set id2(v){
    console.log("Parent:id",v);
  }
  setAttribute(name,value){  // attribute
    this.root.setAttribute(name,value);
  }
  moveTo(parent){
    parent.appendChild(root);
  }
  appendChild(child){  // children
    console.log("Parent::appendChild",child);
  }
}

class Child {

}

/*
var component = createElement(
  Parent, 
  {
    id: "a",
    "class": "b"
  }, 
  createElement(Child, null), 
  createElement(Child, null), 
  createElement(Child, null)
);
*/

let component = <Parent id="a" class="b">
    <Child></Child>
    <Child></Child>
    <Child></Child>
  </Parent>;

console.log(component);