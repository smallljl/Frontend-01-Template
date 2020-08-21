const http = require("http");
const querystring = require("querystring");

const postData = querystring.stringify({
  "content":"鑫哥你真棒hjkdhsakjdhaskjdhksajdhkj"
}); 

const options = {
  host:"localhost",
  port:8080,
  path:"/a?filename=x.html",
  method:"POST",
  headers:{
    'Content-Type': 'application/octet-stream',
    'Content-Length': Buffer.byteLength(postData)
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

req.write(postData);

req.end();