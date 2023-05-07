//Server side implementation of the APIs using express

//Importing necessary Modules
var express = require('express');
var cors = require("cors");
var mongoose = require('mongoose');
var socket = require("socket.io")

const app = express()

//Establishing a server at port 3001

var server_port = 3001
const server = app.listen(server_port, error=> {
    if(error)
        throw error;
    console.log('Server listening on port: ',server_port);
})
const io = socket(server, { cors: true, origins: '*:*' });
//Establising a connection with a mongoDB database to store the partyRoom Details
// const mongoDB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.wzzz8s3.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const mongoDB_URL = `mongodb+srv://himanshu0998:himanshu0998@cluster0.wzzz8s3.mongodb.net/cs553_watchParty?retryWrites=true&w=majority`;

mongoose.connect(mongoDB_URL)
.then(()=>{
    console.log("Connected with MongoDB database");
}).catch(err => {
    console.log(err);
});

//Configuring express application
app.set('view engine', 'ejs');
app.use('/public', express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/room', require('./routes/partyRoomRouter'));

//Maintain a list of attendees based on their socket/connection Ids
const attendees = {}

io.on('connection', socket=>{
    socket.on('EnteredRoom', data=>{
        console.log("EnteredRoom Event: ",data)
        //Creating user dictionary with key as room code, to further access members of a particular room
        attendees[socket.id] = {
            name: data.name,
            partyRoomCode: data.partyRoomCode
        }
        socket.join(data.partyRoomCode)
        //Broadcasting joinee and Room details to all the conections
        socket.broadcast.emit('userInRoom',{name:data.name, partyRoomCode: data.partyRoomCode})

    })

    socket.on('sending_chat_msg', msg=>{
        socket.to(attendees[socket.id].partyRoomCode).emit('chat_msg_recvd', {name: attendees[socket.id].name, chat_msg: msg})
    })

    socket.on('vController', control_settings=>{
        //console.log("User: ",attendees[socket.id].name)
        //console.log(control_settings)
        socket.to(control_settings.partyRoomCode).emit("updateVideoControls",{message:control_settings.message, vcontrol_time: control_settings.vcontrol_time, video_user: attendees[socket.id].name, control_triggered_time:control_settings.control_triggered_time, control_recvd_server: Date.now()})
    })

})
