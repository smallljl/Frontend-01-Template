var stdin = process.stdin;

stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );

function getChar(){
  return new Promise((resolve)=>{
    stdin.on( 'data', function( key ){
      resolve(key);
    });
  })
}

function up(){
  stdout.write();
}


void async function(){
  while(true){
    let char = await getChar();
    if(char === "\u0003"){
      process.exit()
      break;
    }
    console.log(char.split("").map(c=>c.charCodeAt(0)) );
  }
}()