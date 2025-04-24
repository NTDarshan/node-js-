//Streams in nodejs
//n nodejs we can write to a stream
//streams are objects that let you read data from source or write data to destination in continous fashion
//there are 4 types of streams
//1)readable - stream which is used for read operation
//2)writable - stream which is used for write operation
//3)duplex - stream which can be used for both read and write operation 
//4)transform - a type of duplex stream where the output is computed based on input
//each type of stream is an instance of EventEmitter class and throws several events at different instance of times
//for example some of the commonly used events are
//data - this event is fired when there is data available to read
//end - this event is fired when there is no more data available to read
//error - this event is fired when there is any error receiving or writing data
//finish - this event is fired when all the data has been flushed to underlying system
//let us see an example of writing to a stream
//let us write a program to generate 10 random numbers and write it to a file


//let us import the fs module
//using promises
// const fs = require('node:fs/promises');
// ( 
//    async ()=>{
//       const Filehandle = await fs.open('random.txt','w');
//       console.time('write')
//       for(let i=0;i<10000;i++){
//          await Filehandle.write( `${i}`)
//       }
//       console.timeEnd('write')
//       await Filehandle.close()
//     }
// )()

//using callbacks
// const fs = require('node:fs');
// (async () => {
//    console.time('write');
//    fs.open('random.txt', 'w', (err, fd) => {
//       for(let i = 0; i < 10000; i++) {
//          fs.write(fd, `${i}`, (err) => {
//             if (err) throw err;
//          });
//       }
//       console.timeEnd('write');
//    });
// })();



//let us import the fs module
//using streams
// const fs = require('node:fs/promises');
// ( 
//    async ()=>{
//       const Filehandle = await fs.open('random.txt','w');
//       const stream =  Filehandle.createWriteStream()
//       console.time('write')
//       for(let i=0;i<10000;i++){
//         const buffer = Buffer.from(`${i}` , "utf-8")
//          stream.write(buffer)
//       }
//       console.timeEnd('write')
//       await Filehandle.close()
//     }
// )()


const fs = require('node:fs/promises');
( 
   async ()=>{
      const Filehandle = await fs.open('scr.txt','w');
      const stream =  Filehandle.createWriteStream()
    //   console.log(stream.writableHighWaterMark)
    //   console.log(stream.writableLength)

    //   const buff = Buffer.alloc(16386 , 10)
    //  console.log(stream.write(Buffer.alloc(1,'a')))
    //   console.log(stream.write(buff))


    //   //stream.on() is used to listen to events 
    //   stream.on('drain',()=>{
    //     console.log(stream.writableLength)
    //      console.log('we are safe to write more data')
    //   })

    let i =0
    const writemany = () =>{
        while ( i < 1000000){
            const buff = Buffer.from(` ${i} `, "utf-8")
            if(i == 999999){
               return stream.end(buff)
             } 
            if(!stream.write(buff)) break;
            i++
        }
    }

        writemany()
        
        //called when streams buffer is empty and can be used to write more data
        stream.on('drain',()=>{
            console.log(stream.writableLength)
             console.log('we are safe to write more data')
           writemany()

        })
    
        stream.on('finish',()=>{
            console.log('all data has been flushed to underlying system')
            Filehandle.close()

        })
      
    }
)()