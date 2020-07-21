// React版的创建
import {createElement,Text,Wrapper} from "./createElement";

class Carousel {
  constructor(config){
    this.children = [];
    this.attributes  = new Map();
    this.properties = new Map();
  }
  render(){
    return <div class="carousel">
      { this.data.map(url=>{
        let element = <img src={url}/>;
        element.addEventListener("dragstart",event=>event.preventDefault());
        return element;
      })}
    </div>
  }
  setAttribute(name,value){  // attribute
    this[name] = value;
  }
  appendChild(child){
    this.children.push(child);
  }
  mountTo(parent){
    this.render().mountTo(parent);
  }
}

let component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]}></Carousel>

component.mountTo(document.body);

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
////////////////////////////////////////////////
/*
class MyComponent {
  constructor(config){
    this.children = [];
  }
  render(){
    return <article>
      <header>I'am a header</header>
      {this.slot}
      <footer>I'am a footer</footer>
    </article>
  }
  setAttribute(name,value){  // attribute
    this.root.setAttribute(name,value);
  }
  appendChild(child){
    this.children.push(child);
    // child.mountTo(this.root);
  }
  mountTo(parent){
    this.slot = <div></div>;
    for(let child of this.children){  // 子节点添加到父节点
      this.slot.appendChild(child);
    }
    this.render().mountTo(parent);
  }
}
*/
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
/*
// let component = <div id="a" class="b" style="width:100px;height:100px;background:lightgreen;">
//     <div>test</div>
//     <p></p>
//     <div></div>
//     <div></div>
//   </div>;

let component = <MyComponent>
        <div>text text text</div>
      </MyComponent>;

component.mountTo(document.body);
*/
////////////////////////////////////////////////