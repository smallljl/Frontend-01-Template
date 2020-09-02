const http = require('http');
const fs = require("fs");
const unzip = require("unzipper");
const https = require("https");
// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {
  // let matched = req.url.match(/filename=([^&]+)/);
  // let filename = (matched && matched[1]);
  // if(!filename)
  //   return;
  // let writeStream = fs.createWriteStream("../server/public/" + filename);
  if(req.url.match(/^\/auth/))
    return auth(req,res);
  if(req.url.match(/^\/favicon.ico/)) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
    return;
  }

  const options = {
    hostname:'api.github.com',
    port:443,
    path:'/user',
    method:"GET",
    headers:{
      "Authorization":"token "+req.headers.token,
      "User-Agent":"toy-publish-jx"
    }
  };

  const request = https.request(options,(response)=>{
    // console.log("statusCode:",res.statusCode);
    // console.log("headers:",res.headers);
    let body = "";
    response.on("data",(d)=>{
      body += d.toString();
    });
    response.on("end",(d)=>{
      let user = JSON.parse(body);
      console.log(user);
      // 权限检查
      let writeStream = unzip.Extract({"path":"../server/public"});
      req.pipe(writeStream);
      req.on("end",()=>{
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('o11kay');
      });
    });
  })

  request.on("error",(e)=>{
    console.error(e);
  });    
  request.end();


  /*
  let writeStream = unzip.Extract({"path":"../server/public"});

  req.on("data",thunk=>{
    writeStream.write(thunk);
  });

  req.on("end",(thunk)=>{
    writeStream.end(thunk);
  });

  req.pipe(writeStream);
  req.on("end",()=>{
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  });
  */
});

function auth(req,res){
  let code = req.url.match(/code=([^&]+)/)[1];
  let state = "abc123"
  let client_secret = "6758b2d95f18d450f7b213eb9deedb61e687a096"
  let client_id = "Iv1.ef86869230f38d76"
  let redirect_uri =   encodeURIComponent("http://localhost:8081/auth");
  let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  let url = `https://github.com/login/oauth/access_token?${params}`;

  const options = {
    hostname: "github.com",
    port:443,
    path:`/login/oauth/access_token?${params}`,
    method:"POST"
  }

  const request = https.request(options,(response)=>{
    // console.log("statusCode:",res.statusCode);
    // console.log("headers:",res.headers);

    response.on("data",(d)=>{
      let result = d.toString().match(/access_token=([^&]+)/);

      if(result){
        let token = result[1];
        res.writeHead(200,{
          'Content-Type': 'text/html',
          'access_token': token 
        });
        res.end(`<a href="http://localhost:8082/publish?token=${token}">publish</a>`);
      } else {
        res.writeHead(200,{
          'Content-Type': 'text/plain',
        });
        res.end("error");
      }
    });

    console.log(code);
  })

  request.on("error",(e)=>{
    console.error(e);
  });    
  request.end();

  // https.request(url,{
  //   method:"POST"
  // },(res) => {
  //   console.log(res);
  // });

 
}

server.listen(8081);