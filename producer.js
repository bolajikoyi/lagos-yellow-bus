const { Kafka } = require('kafkajs');
const data = require('./bus.json')

const main = async (val)=>{
  try{

    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:9092']
    })

    const producer = kafka.producer()

    await producer.connect()
    await producer.send({
      topic: 'yellow-bus',
      messages: [
        { value:  val},
      ],
    })

    await producer.disconnect()
  }
    
  catch(e){
    console.log('Something went wrong'+e)
  }
}

// Emitting a single row form the json data after every iteration
// https://stackoverflow.com/questions/12876960/setinterval-with-an-array

// iteration is repeated for every item in the array
const Arr = data.features[0].geometry.coordinates;
let index = 0;

  setInterval(()=>{
    let newData = JSON.stringify(Arr[index])
    console.log(Arr[index])
    main(newData)
  
    if(index == Arr.length-1){
      index = 0
    }
    
    index++    
    
  }, 500)
//   Iteration is not repeated
// var Arr = data.features[0].geometry.coordinates;
// var alertLoop = function(i) {
//     if (Arr[i]) {
//         let newData = JSON.stringify(Arr[i])
//         main(newData);
//         console.log(Arr[i])
//         setTimeout(function(){alertLoop(i+1);}, 500);
//     }
// }
// alertLoop(0);

