import {createElement,Text,Wrapper} from "./createElement";
import { Timeline,Animation} from "./animation.js";

let linear = t => t;  // 匀速

export class Carousel {
  constructor(config){
    this.children = [];
    this.attributes  = new Map();
    this.properties = new Map();
  }
  render(){
    
    let timeline = new Timeline();
    timeline.start();

    let position = 0;

    let nextPicStopHandler = null;

    

    

    let chlidren = this.data.map((url,currentPosition)=>{
      
      let onStart = () => {
        clearTimeout(nextPicStopHandler);
        timeline.pause()
      }
      
      let onPan = (event) => {
        let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length; // 最后一个
        let nextPosition = (currentPosition + 1) % this.data.length;  // 下一个

        let lastElement = chlidren[lastPosition];
        let currentElement = chlidren[currentPosition];
        let nextElement = this.children[nextPosition];

        let currentTransformValue = /translateX\(([\s\S]+)px\)/.match()

        console.log(currentElement,currentElement.style.transform);
      }

      let element = <img src={url} onStart={ onStart } onPan={onPan} enableGesture={true}/>;
      element.addEventListener("dragstart",event=>event.preventDefault());
      return element;
    });

    let root = <div class="carousel">
      {  chlidren  }
    </div>;
    
   

    
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;  // 下一个
      let current = chlidren[position];
      let next = chlidren[nextPosition];

      let currentAnimation = new Animation(current.style,"transform",
        - 100*position,-100 - 100*position,500,0,linear, v => `translateX(${5 * v}px)`);
      let nextAnimation = new Animation(next.style,"transform",
        100 -100*nextPosition,-100*nextPosition,500,0,linear, v => `translateX(${5 * v}px)`);

      timeline.add(currentAnimation);
      timeline.add(nextAnimation);

      position = nextPosition;
      nextPicStopHandler = setTimeout(nextPic,3000);
    }
    nextPicStopHandler = setTimeout(nextPic,3000);
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