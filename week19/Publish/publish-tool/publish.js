const http = require("http");
const querystring = require("querystring");
const fs = require("fs");

const postData = querystring.stringify({
  "content":"鑫哥你真棒hjkdhsakjdhaskjdhksajdhkj"
}); 

let filename = "./cat.jpg";


// 文件大小
fs.stat(filename,(err,stat)=>{
  console.log(stat.size);

  const options = {
    host:"localhost",
    port:8081,
    path:"/a?filename="+filename,
    method:"POST",
    headers:{
      'Content-Type': 'application/octet-stream',
      // 'Content-Length': Buffer.byteLength(postData)
      'Content-Length':stat.size
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
  
  let readStream = fs.createReadStream(filename);
  readStream.pipe(req);
  readStream.on("end",()=>{
    req.end();
  })
  // req.write(postData);

});



