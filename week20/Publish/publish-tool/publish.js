
const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
const archiver = require("archiver");
const child_process = require("child_process");

const postData = querystring.stringify({
  "content":"鑫哥你真棒hjkdhsakjdhaskjdhksajdhkj"
}); 

let packname = "./package";

let redirect_uri = encodeURIComponent("http://localhost:8081/auth");
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.ef86869230f38d76&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123abc`);

const server = http.createServer((request,res)=>{
  const token = request.url.match(/token=([^&]+)/)[1];
  const options = {
    host:"localhost",
    port:8081,
    path:"/a?filename="+"package.zip",
    method:"POST",
    headers:{
      "token":token,
      'Content-Type': 'application/octet-stream',
      // 'Content-Length': Buffer.byteLength(postData)
      //'Content-Length':0
    }
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  
  var archive = archiver("zip",{
    zlib:{level:9}
  });

  archive.directory(packname,false);

  archive.finalize();

  archive.pipe(req);

  archive.on("end",()=>{
    req.end();
    console.log("publish success!!!");
    server.close();
  });

});

server.listen(8082);


// 文件大小
//fs.stat(filename,(err,stat)=>{
  // console.log(stat.size);

/*  
  const options = {
    host:"localhost",
    port:8081,
    path:"/a?filename="+"package.zip",
    method:"POST",
    headers:{
      'Content-Type': 'application/octet-stream',
      // 'Content-Length': Buffer.byteLength(postData)
      //'Content-Length':0
    }
  };


 

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    /*res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  
  var archive = archiver("zip",{
    zlib:{level:9}
  });

  archive.directory(packname,false);

  archive.finalize();

  archive.pipe(req);

  archive.on("end",()=>{
    req.end();
    console.log(child_process)
    let redirect_uri = encodeURIComponent("http://localhost:8081/auth");
    child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.ef86869230f38d76&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123abc`);
  });
  
  */
 /*
  let readStream = fs.createReadStream(filename);
  readStream.pipe(req);
  readStream.on("end",()=>{
    req.end();
  })
  // req.write(postData);
  */

// });



