function *foo(){
  yield 1;
  yield 2;
  yield 3;
}

var g = foo();
console.log(g.next());


let iframe = document.createElement("iframe");
document.body.appendChild(iframe);
iframe.contentWindow;
iframe.contentWindow.Object.prototype
iframe.contentWindow.document.body.innerHTML = "<script> window.o = {}</script>";
iframe.contentWindow.eval("this.o = {}");
iframe.contentWindow.o instanceof Object;
var o = iframe.contentWindow.o;
Object.getPrototypeOf(o) === Object.prototype;