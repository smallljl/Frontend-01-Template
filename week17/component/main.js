/*
 * @Author: your name
 * @Date: 2020-08-01 10:55:35
 * @LastEditTime: 2020-08-03 10:43:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Frontend-01-Template\week17\component\main.js
 */
// React版的创建
import { createElement,Text,Wrapper } from "./createElement";
import { Timeline,Animation } from "./animation.js";
import { Carousel } from "./Carousel.js";
import { TabPanel } from "./TabPanel.js"

/*
let component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]}></Carousel>
component.mountTo(document.body);
*/

/*
let panel = <TabPanel title="this is my panel">
  <span title="title1">This is content1</span>
  <span title="title2">This is content2</span>
  <span title="title3">DC  This is content3</span>
  <span title="title4">This is content4</span>
</TabPanel>;

let panel2 =  <CarouselView title="this is my panel">
  <span title="title1">This is content1</span>
  <span title="title2">This is content2</span>
  <span title="title3">This is content3</span>
  <span title="title4">This is content4</span>
</CarouselView>;
*/

let list = <ListView data={data}>
  <figure>
    <img src={url}/>
    <figcaption></figcaption>
  </figure>
</ListView>

panel.mountTo(document.body);
panel2.mountTo(document.body);

window.panel = panel;