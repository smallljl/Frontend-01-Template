import { createElement,Text,Wrapper } from "./createElement";
import { Timeline,Animation } from "./animation.js";


export class ListView {
  constructor(config){
    this.children = [];
    this.attributes  = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }
  render(){
    let data = this.getAttribute("data");
    return <div class="list-view" style="width:300px;">
      {
        data.map(this.children[0])
      }
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