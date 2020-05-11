const net = require("net");
/**
 * @description:  请求
 * @param {type} 
 * @return: 
 */
class Request {
    constructor(options) {
        this.method = options.method || "GET",
        this.host = options.host;
        this.port = options.port || 80;
        this.body = options.body || {};
        this.path = options.path || "/";
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(this.headers["Content-Type"] === "application/json"){
            this.bodyText = JSON.stringify(this.body);
        } else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded"){
            this.bodyText = Object.keys(this.body).map(key => `${encodeURIComponent(key) }=${this.body[key]}`).join("&");
        }
        this.headers["Content-Length"] = this.bodyText.length;
    }

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key=> `${key}: ${this.headers[key]}`).join("\r\n")}
\r
${this.bodyText}`;
    }

    open(method,url){

    }

    send(connection){
        return new Promise((resolve,reject)=>{
            const parser = new ResponseParser();
            if(connection){
                connection.wirte(this.toString())
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
                        resolve(parser.response)
                    }
                    connection.end();
                });
                connection.on("end",()=>{
                    console.log("disconnected from sercer");
                });
                connection.on("error",(err)=>{
                    reject(err)
                    connection.end();
                });
            }
        })
    }
}

/**
 * @description: 响应
 * @param {type} 
 * @return: 
 */
class Response {

}


class ResponseParser {
    constructor(){
        this.WAITING_STATUS_LINE = 0;   // 请求行
        this.WAITING_STATUS_LINE_END = 1;  // 请求头
        this.WAITING_HEADER_NAME = 2;  // 
        this.WAITING_HEADER_SPACE = 3
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

    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response(){
        console.log(this.statusLine)
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode:RegExp.$1,
            statusText:RegExp.$2,
            headers:this.headers,
            body:this.bodyParser.content.join("")
        }
    }

    receive(string){
        for(let i = 0; i < string.length;i++)
            this.receiveChar(string.charAt(i));
    }
    receiveChar(char){
        if(this.current === this.WAITING_STATUS_LINE){
            if(char === "\r")
                this.current = this.WAITING_STATUS_LINE_END;
            if(char === "\n")
                this.current = this.WAITING_HEADER_NAME;
            else {
                this.statusLine += char;
            }
        }
        else if(this.current === this.WAITING_STATUS_LINE_END){
            if(char === "\n"){
                this.current = this.WAITING_HEADER_NAME;
            }
        }
        else if(this.current === this.WAITING_HEADER_NAME){
            if(char === ":"){
                this.current = this.WAITING_HEADER_SPACE;
            }
            else if(char === "\r"){
                this.current = this.WAITING_HEADER_BLOCK_END
                if(this.headers["Transfer-Encoding"] === "chunked"){
                    this.bodyParser = new ThunkedBodyParser();
                }
            } 
            else {
                this.headerName += char;
            }
        }
        else if(this.current === this.WAITING_HEADER_SPACE){
            if(char === " "){
                this.current = this.WAITING_HEADER_VALUE;
            }
        }
        else if(this.current === this.WAITING_HEADER_VALUE){
            if(char === "\r"){
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue += char;
            }
        }
        else if(this.current === this.WAITING_HEADER_LINE_END){
            if(char === "\n"){
                this.current = this.WAITING_HEADER_NAME;
            }
        }
        else if(this.current === this.WAITING_HEADER_BLOCK_END){
            if(char === "\n"){
                this.current = this.WAITING_BODY;
            }
        }
        else if(this.current === this.WAITING_BODY){
            this.bodyParser.receiveChar(char);
        }
    }
}


class ThunkedBodyParser{
    constructor(){
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READTRUNK = 2;
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
                    console.log(this.content);
                    this.isFinished = true;
                }
            } else {
                this.length *= 10;
                this.length += char.charCodeAt(0) - "0".charCodeAt(0);
            }
        }
        else if(this.current === this.WAITING_LENGTH_LINE_END){
            if(char === "\n"){
                this.current = this.READTRUNK;
            }
        }
        else if(this.current === this.READTRUNK){
            this.content.push(char);
            this.length --;
            if(this.length === 0){
                this.current = this.WAITING_NEW_LINE;
            }
        }
        else if(this.current === this.WAITING_NEW_LINE){
            if(char === "\r"){
                this.current = this.WAITING_NEW_LINE_END;
            }
        }
        else if(this.current === this.WAITING_NEW_LINE_END){
            if(char === "\n"){
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}

void async function (){
    let request = new Request({
        method:"POST",
        host:"127.0.0.1",
        port:"8088",
        headers:{
            ["X-Foo"]:"customed"
        },
        path:"/",
        body: {
            name:"winter"
        }
    });
    let response =  await request.send();
    console.log(response);
}();


/*
const net = require("net");
const client = net.createConnection(
    {
        host:"127.0.0.1",
        port:8088 
    },()=>{

    let request = new Request({
        method:"POST",
        host:"127.0.0.1",
        port:"8088",
        headers:{
            ["X-Foo"]:"customed"
        },
        path:"/",
        body: {
            name:"winter"
        }
    });

    console.log(request.toString());
    client.write(request.toString()); //  发送
    // client.write("POST / HTTP/1.1\r\n")
    // client.write("Content-Type: application/x-www-form-urlencoded\r\n");
    // client.write("Content-Length: 11\r\n");
    // client.write("\r\n");
    // client.write("name=winter\r\n");
});
client.on("data",(data)=>{
    console.log(data.toString());
    client.end();
});
client.on("end",()=>{
    console.log("disconnected from sercer");
});
client.on("error",(err)=>{
    console.log(err);
    client.end();
});
*/
