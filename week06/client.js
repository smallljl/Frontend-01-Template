const net = require("net");
const parser = require("./parser01.js")
class Request {
    constructor(options){
        this.method = options.method;
        this.host = options.host;
        this.port = options.port || 80;
        this.body = options.body || {};
        this.path = options.path || "/";
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"])
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        if(this.headers["Content-Type"] === "application/json")
            this.bodyText = JSON.stringify(this.body);
        else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded")
            this.bodyText = Object.keys(this.body).map(key=>`${encodeURIComponent(key)} = ${this.body[key]} `).join("&");
        this.headers["Content-Length"] = this.bodyText.length;
    }

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key=> `${key}: ${this.headers[key]}`).join("\r\n")}
\r
${this.bodyText}`
    }

    open(method,url){

    }

    send(connection){
        return new Promise((resolve,reject)=>{
           const parser = new ResponseParser();
           if(connection){
               connection.write(this.toString());
           } else {
               connection = net.createConnection({
                    host:this.host,
                    port:this.port
               },()=>{
                   connection.write(this.toString());
               });
               connection.on("data",(data)=>{
                    parser.receive(data.toString());
                    if(parser.isFinished){
                        resolve(parser.response);
                    }
                    // console.log(parser.statusLine);
                    // console.log(parser.headers);
                    // console.log(parser.bodyParser)
                    // console.log(data.toString());
                    connection.end();
               });
               connection.on("end",()=>{
                    console.log("disconnected from server");
               });
               connection.on("error",(err)=>{
                    reject(err);
                    connection.end();
               });
           }
        });
    }
}

class ResponseParser {
    constructor(){
        this.WAITING_STATUS_LINE = 0; 
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }

    receive(string){
        for(let i = 0; i < string.length; i++){
            this.receiveChar(string.charAt(i));   
        }
    }
    receiveChar(char){
        if(this.current === this.WAITING_STATUS_LINE){
            if(char === "\r"){
                this.current = this.WAITING_STATUS_LINE_END;
            }
            if(char === "\n"){
                this.current = this.WAITING_HEADER_NAME;
            }
            else {
                this.statusLine += char;
            }
        } else if(this.current === this.WAITING_STATUS_LINE_END){
            if(char === "\n"){
                this.current = this.WAITING_HEADER_NAME;
            }
        
        }  // this.headers
        else if(this.current === this.WAITING_HEADER_NAME){
            if(char === ":"){
                this.current = this.WAITING_HEADER_SPACE;
            } else if(char === "\r"){
                this.current = this.WAITING_HEADER_BLOCK_END;
                if(this.headers["Transfer-Encoding"] === "chunked"){
                    this.bodyParser = new ThunkedBodyParser();
                }
            } else {
                this.headerName+=char;
            }
        } else if(this.current === this.WAITING_HEADER_SPACE){
            if(char === " "){
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if(this.current === this.WAITING_HEADER_VALUE){
            if(char === "\r"){
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue+=char;
            }
        } else if(this.current === this.WAITING_HEADER_LINE_END){
            if(char === "\n"){
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if(this.current === this.WAITING_HEADER_BLOCK_END){
            if(char === "\n"){
                this.current = this.WAITING_BODY;
            }
            // 开始thunk 的解析
        } else if(this.current === this.WAITING_BODY){
            // thunkw
            this.bodyParser.receiveChar(char);
        } 
    }

    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\S\s]+)/);
        return {
            statusCode:RegExp.$1,
            statusText:RegExp.$2,
            headers:this.headers,
            body:this.bodyParser.content.join("")
        }
    }
}

class ThunkedBodyParser{
    constructor(){
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READTRUNK  = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char){
        if(this.current === this.WAITING_LENGTH){
            if(char === "\r"){
                this.current = this.WAITING_LENGTH_LINE_END;
                if(this.length === 0){
                    this.isFinished = true;
                }
            } else {
                 this.length *= 16;
                 this.length += parseInt(char,16);
            }
        } else if(this.current === this.WAITING_LENGTH_LINE_END){
            if(char === "\n"){
                this.current = this.READTRUNK;
            }
        } else if(this.current === this.READTRUNK){
            this.content.push(char);
            this.length--;
            if(this.length === 0){
                this.current = this.WAITING_NEW_LINE;
            }
        } //  thunk 已经读完了
        else if(this.current === this.WAITING_NEW_LINE){
            if(char === "\r"){
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if(this.current === this.WAITING_NEW_LINE_END){
            if(char === "\n"){
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}

void async function(){
    let request = new Request({
        method:"POST",
        host:"127.0.0.1",
        port:"8080",
        headers:{
            ["X-Foo"]:"customed"
        },
        path:"/",
        body:{
            name:"winter"
        }
    });
    let response = await request.send();
    let don = parser.parseHTML(response.body);
}();