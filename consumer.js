const { Kafka } = require('kafkajs')
const express = require('express')
const app = express()
// const producer = require('./producer')

const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});


io.on('connection', (socket) => {
    console.log('New client connected');
    const main = async ()=>{

        const kafka = new Kafka({
          clientId: 'my-app',
          brokers: ['localhost:9092']
        })
        
      
        const consumer = kafka.consumer({ groupId: 'test-group' })
    
          await consumer.connect()
          await consumer.subscribe({ topic: 'yellow_bus', fromBeginning: true })
          await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                  console.log(
                  message.value.toString(),
                  )
                socket.emit('newMessage', message.value.toString())
            },
          })
    }
    main()

    socket.on('disconnect', ()=> {
        console.log('Client disconnected')
    });
});

server.listen(3600, () => {
    console.log('listening on *:3600');
  });