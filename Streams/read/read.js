const fs = require('node:fs/promises');

(
    async () => {
      const filehandleRead = await fs.open('scr.txt', 'r');
      const filehandleWrite = await fs.open('dest.txt', 'w');

      const streamRead = filehandleRead.createReadStream({highWaterMark : 64 * 1024} );  // we can specify the highWaterMark in bytes as we want
      const streamWrite = filehandleWrite.createWriteStream();
       
      let split = ' '
      streamRead.on('data', (chunk) => {
        const number = chunk.toString("utf-8").split('  ');

        if(Number(number[0]) != Number(number[1])-1){
            if(split) number[0] = split.trim() + number[0].trim();
         }

        if(Number(number[number.length - 2]) + 1 !==  Number(number[number.length - 1])){
           split = number.pop();
        }
       
        number.forEach((num) => {
            let n = Number(num) ;

            if( n % 2 === 0 ){
               if(!streamWrite.write(" " + n + " ")) {
                  streamRead.pause();
               }
            }
        })
     
       
         if (!streamWrite.write(chunk)){
            streamRead.pause();
         }

         streamWrite.on('drain', () => {
            streamRead.resume();
         })
      })
    }
)();