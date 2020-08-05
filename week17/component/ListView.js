import { createElement,Text,Wrapper } from "./createElement";
import { Timeline,Animation } from "./animation.js";


export class iew {
  constructor(config){
    this.children = [];
    this.attributes  = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }
  render(){
    return <div class="tab-panel" style="width:300px;">
        <h1 style="width:300px;margin-bottom:0px;">{this.titleViews}</h1>
        <div style="border:solid 1px lightgreen;">
          { this.childViews }
        </div>  
    </div>
  }
  
  setAttribute(name,value){  // attribute
    this[name] = value;
  }

  getAttribute(name){
    return this[name];
  }
  appendChild(child){
    this.children.push(child);
  }

  mountTo(parent){
    console.log(this.render())
    this.render().mountTo(parent);
  }
}