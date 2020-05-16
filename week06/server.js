/*
 * @Author: your name
 * @Date: 2020-05-15 09:12:45
 * @LastEditTime: 2020-05-16 18:21:15
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \Frontend-01-Template\week06\server.js
 */ 
const http = require("http");
const server = http.createServer((req,res)=>{
    console.log("request reveived");
    console.log(req.headers);
    res.setHeader("Content-Type","text/html");
    res.setHeader("X-Foo","bar");
    res.writeHead(200,{"Content-Type":"text/plain"});
    res.end(`<html maaa=a>
    <head>
        <style>
            body div #myid{
                width:100px;
                background-color:#ff5000;
            }
            body div img{
                width:30px;
                background-color:#ff1111;
            }
        </style>
    </head>
    <body>
        <div>
            <img id="myid"/>
            <img/>
        </div>   
    </body>
    `);
}).listen(8080);