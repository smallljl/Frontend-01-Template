# 每周总结可以写在这里
Float 
Infitaty
NaN
表达式
a.b === a[b];  // java反射
foo`bbb`
super.b
super["b"]
new.target 
new Foo();

function foo(){
    console.log(new.target)
}

new foo();

super()  父类的属性
super.a 

String 

new a()['b'];
foo()['b']


++a++  不满足

new (new cls2()) new cla2() => new (); ** 带括号的参数更高 

单目运算符  void 0  => undefined


!function(){} => 变成表达式

void function(){}

!!1 类型转换

** 唯一一个又结合

Symble(1);

装箱和拆箱


function *g(){
    yield 0;
    yield 1;
    yield 4;
}
// 可以迭代的对象
for(let p of g()){

}


//访问不到
function Class(){
    public:
        this.a = 1;
        this.b = 2;
    private:
        var x =3;
        var y = 4;
}

try{
    
}catch(e){
    let e  // 声明
}


function *get(){
    yield 1;
    yield 2;
}

let gen = get();
gen.next();
gen.next();
gen.next();
3

function sleep(d){
    return new Promise(resolve => setTimeout(resolve,d))
}

void async function(){
    var i = 0;
    while(true){
        console.log(i++);
        await sleep(1000);
    }
}()
