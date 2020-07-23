class Timeline {
    constructor(){
      this.animations = [];
      this.requestID = null;
      this.tick = () => {
        let t =  Date.now() - this.startTime;
        let animations = this.animations.filter(animation => !animation.finished);
        for(let animation of this.animations){
          let {object,property,start,end,timingFunction,duration,template,delay} = animation;
          let progression = timingFunction((t - delay)/duration); // 0 - 1 之间的数
          if(t > animation.duration + animation.delay){ // 到末尾了
            progression = 1;
            animation.finished = true;
          }
          let value = start + progression * (end - start); // value 就是根据progression算出当前的位置
          object[property] = template(value);
        }
        if(animations.length)
          this.requestID = requestAnimationFrame(this.tick);
      }
    }
    pause(){
      if(this.requestID !== null)
        cancelAnimationFrame(this.requestID);
    }
    start(){
      this.startTime = Date.now();
      this.tick();
    }
    add(animation){
      this.animations.push(animation);
    }
  }
  
class Animation {
    constructor(object,property,template, start,end,duration,delay,timingFunction){
      this.object = object;
      this.template = template;
      this.property = property;
      this.start = start;
      this.end = end;
      this.duration = duration;
      this.delay = delay;  // 延迟
      this.timingFunction = timingFunction;
      // ease linear easeIn easeOut
    }
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