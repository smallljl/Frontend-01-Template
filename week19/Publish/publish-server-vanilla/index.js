const http = require('http');
const fs = require("fs");
const unzip = require("unzipper");

// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {
  // let matched = req.url.match(/filename=([^&]+)/);
  // let filename = (matched && matched[1]);
  // if(!filename)
  //   return;
  // let writeStream = fs.createWriteStream("../server/public/" + filename);

  let writeStream = unzip.Extract({"path":"../server/public"});

  /*
  req.on("data",thunk=>{
    writeStream.write(thunk);
  });

  req.on("end",(thunk)=>{
    writeStream.end(thunk);
  });
  */

  req.pipe(writeStream);
  req.on("end",()=>{
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  });
});

server.listen(8081);