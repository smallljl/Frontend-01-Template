import { createElement,Text,Wrapper } from "./createElement";
import { Timeline,Animation } from "./animation.js";


export class TabPanel {
  constructor(config){
    this.children = [];
    this.attributes  = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }
  render(){

    this.childViews = this.children.map(child => <div style="width:300px;min-height:300px">{child}</div>);
    this.titleViews = this.children.map((child,i) => <span onClick={ () => this.select(i)} 
        style="width:300px;background:lightgreen;margin:5px 5px 0px 5px;font-size:24px;padding:0px;">{child.getAttribute("title") || " "}</span>);

    setTimeout(() => this.select(0) , 16);

    return <div class="tab-panel" style="width:300px;">
        <h1 style="width:300px;margin-bottom:0px;">{this.titleViews}</h1>
        <div style="border:solid 1px lightgreen;">
          { this.childViews }
        </div>  
    </div>
  }
  

  select(i){
    for(let view of this.childViews){
      view.style.display = "none";
    }
    this.childViews[i].style.display = "";
    for(let view of this.titleViews){
      view.classList.remove("selected");
    }
    this.titleViews[i].classList.add("selected");
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