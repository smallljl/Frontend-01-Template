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
    

    let children = this.data.map((url,currentPosition)=>{

      let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length; // 最后一个
      let nextPosition = (currentPosition + 1) % this.data.length;  // 下一个

      let offset = 0;

      let onStart = () => {
        clearTimeout(nextPicStopHandler);
        timeline.pause()

        let currentElement = children[currentPosition];

        let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);  // 第一个括号匹配到的内容
        offset = currentTransformValue + 500 * currentPosition;

      }
      
      let onPan = (event) => {
        console.log(children);
        let dx = event.clientX - event.startX;
        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let currentTransformValue = - 500 * currentPosition + offset  + dx;
        let lastTransformValue = -500 + -500 * lastPosition + offset  + dx;
        let nextTransformValue = 500 -500 * nextPosition + offset  + dx;

       
        console.log(currentTransformValue + dx);
        currentElement.style.transform = `translateX(${currentTransformValue}px)`;
        lastElement.style.transform = `translateX(${lastTransformValue}px)`;
        nextElement.style.transform = `translateX(${nextTransformValue}px)`;

      }

      let onPanend = event => {
        let dx = event.clientX - event.startX;
        let lastElement = children[lastPosition];
        let currentElement = children[currentPosition];
        let nextElement = children[nextPosition];

        let direction = 0;
        if(dx + offset > 250){
          direction = 1;
        } else if(dx + offset < -250) {
          direction = -1;
        }

        timeline.reset();
        timeline.start();

        let currentTransformValue = - 500 * currentPosition + offset  + dx;
        let lastTransformValue = -500 + -500 * lastPosition + offset  + dx;
        let nextTransformValue = 500 -500 * nextPosition + offset  + dx;

        let currentAnimation = new Animation(currentElement.style,"transform",
          currentTransformValue,- 500 * currentPosition - direction * 500,500,0,linear, v => `translateX(${5 * v}px)`);
        let nextAnimation = new Animation(nextElement.style,"transform",
          nextTransformValue,500 -500 * nextPosition + direction * 500,500,0,linear, v => `translateX(${5 * v}px)`);
        let lastAnimation = new Animation(lastElement.style,"transform",
          lastTransformValue,-500 + -500 * lastPosition + direction * 500,500,0,linear, v => `translateX(${5 * v}px)`);

        timeline.add(currentAnimation);
        timeline.add(nextAnimation);
        timeline.add(lastAnimation);

        position = (position - offset + this.data.length) % this.data.length;

        nextPicStopHandler = setTimeout(nextPic,3000);

      }

      let element = <img src={url} onStart={ onStart } onPan={onPan} onPanend={onPanend} enableGesture={true}/>;
      element.style.transform = "translateX(0px)";
      element.addEventListener("dragstart",event=>event.preventDefault());
      return element;
    });

    let root = <div class="carousel">
      {  children  }
    </div>;
    
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;  // 下一个
      let current = children[position];
      let next = children[nextPosition];

      console.log(current);
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