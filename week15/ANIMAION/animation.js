export class Timeline {
  tick(){
    requestAnimationFrame(()=> this.tick());
  }
  start(){

  }
}

export class Animation {

}

/*

let animation = new Animation(object,property,start,end,duration,delay,timingFunction);
let animation2 = new Animation(object,property,start,end,duration,delay,timingFunction);

let timeline = new Timeline;
timeline.add(animation);


timeline.start();

timeline.pause(); //暂停
timeline.resume(); // 重新开始

timeline.stop();

setTimeout
setInterval
requestAnimationFrame

*/