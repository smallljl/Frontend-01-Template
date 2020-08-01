import { createElement,Text,Wrapper } from "./createElement";
import { Timeline,Animation } from "./animation.js";


export class Panel {
  constructor(config){
    this.children = [];
    this.attributes  = new Map();
    this.properties = new Map();
  }
  render(){
      return <div class="panel" style="border:solid 1px lightgreen;width:300px;">
        <h1 style="background-color:lightgreen;width:300px;margin:0;">{ this.title }</h1>
        <div style="width:300px;min-height:300px">{  this.children  }</div>  
      </div>
  }
  setAttribute(name,value){  // attribute
    this[name] = value;
  }
  appendChild(child){
    this.children.push(child);
  }
  mountTo(parent){
    console.log(this.render())
    this.render().mountTo(parent);
  }
}