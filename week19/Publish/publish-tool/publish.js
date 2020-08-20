const http = require("http");

const postData = querystring.stringify({
  
})


const options = {
  host:"localhost",
  port:8080,
  path:"/a?filename=x.html",
  method:"GET",
};

const req = http.request(options);

req.end();