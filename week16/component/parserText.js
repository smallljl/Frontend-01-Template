let parser  = require("./parser");

let res = parser.parseHTML(`
  <script>a</script>
`);
debugger
console.log(res);