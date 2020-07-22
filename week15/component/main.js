
// React版的创建
import {createElement,Text,Wrapper} from "./createElement";

class Carousel {
  constructor(config){
    this.children = [];
    this.attributes  = new Map();
    this.properties = new Map();
  }
  render(){
    let chlidren = this.data.map(url=>{
      let element = <img src={url}/>;
      element.addEventListener("dragstart",event=>event.preventDefault());
      return element;
    });

    let root = <div class="carousel">
      {  chlidren  }
    </div>;
    
    let position = 0;
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;  // 下一个
      let current = chlidren[position];
      let next = chlidren[nextPosition];
      current.style.transition = "ease 0s";
      next.style.transition = "ease 0s";
      current.style.transform = `translateX(${- 100*position}%)`;
      next.style.transform = `translateX(${100 -100*nextPosition}%)`;
      setTimeout(function(){
        current.style.transition = "";  // = "" 用 css rule
        next.style.transition = "";
        current.style.transform = `translateX(${-100 - 100*position}%)`;
        next.style.transform = `translateX(${ -100*nextPosition}%)`;
        position = nextPosition;
      },16)
      setTimeout(nextPic,3000);
    }
    setTimeout(nextPic,3000);
    return root;
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