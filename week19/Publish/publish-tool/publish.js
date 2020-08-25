const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
var archiver = require("archiver");

const postData = querystring.stringify({
  "content":"鑫哥你真棒hjkdhsakjdhaskjdhksajdhkj"
}); 

let packname = "./package";

// 文件大小
//fs.stat(filename,(err,stat)=>{
  // console.log(stat.size);

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
    });*/
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  
  var archive = archiver("zip",{
    zlib:{level:9}
  });

  archive.directory(packname,false);

  archive.finalize();

  archive.on("end",()=>{
    console.log("end");
  });

  archive.pipe(req);

  archive.on("end",()=>{
    req.end();
  });
  
 /*
  let readStream = fs.createReadStream(filename);
  readStream.pipe(req);
  readStream.on("end",()=>{
    req.end();
  })
  // req.write(postData);
  */

// });



