import { enableGesture } from "./gesture.js";

export function createElement(Cls,attributes,...children){
  let o;
  if(typeof Cls === "string"){
    o = new Wrapper(Cls);
  } else {
    o = new Cls({
      timer:{}
    });
  }
  for(let name in attributes){
    o.setAttribute(name, attributes[name]);
  }
  let visit = (children) => {
    for(let child of children){
      if(typeof child === "object" && child instanceof Array){
        visit(child);
        continue;
      }
      if(typeof child === "string")
        child = new Text(child);
      // o.children.push(child);
      o.appendChild(child);
    }
  }
  visit(children);
  return o;
}

export class Text{
  constructor(text){
    this.root = document.createTextNode(text);
  }
  mountTo(parent){
    parent.appendChild(this.root);
  }
  getAttribute(name){
    return;
  }
}

export class Wrapper{
  constructor(type){
    this.children = [];
    this.root = document.createElement(type);
  }
  setAttribute(name,value){  // attribute
    this.root.setAttribute(name,value);

    // 绑定事件
    if(name === "enableGesture"){
      enableGesture(this.root);
    }

    if(name.match(/^on([\s\S]+)$/)){
      // 字符转小写
      let eventName = RegExp.$1.replace(/^[\s\S]+/,c => c.toLowerCase());
      this.addEventListener(eventName,value);
    }

  }

  getAttribute(name){
    return this.root.getAttribute(name);
  }

  appendChild(child){
    // child.mountTo(this.root);
    this.children.push(child);
  }
  addEventListener(){
    this.root.addEventListener(...arguments);
  }
  get style(){
    return this.root.style;
  }
  
  get classList(){
    return this.root.classList;
  }

  set innerText(text){
    return this.root.innerText = text;
  }

  mountTo(parent){
    parent.appendChild(this.root);
    for(let child of this.children){  // 子节点添加到父节点
      child.mountTo(this.root);
    }
  }
}