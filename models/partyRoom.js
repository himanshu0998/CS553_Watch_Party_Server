const mongoose = require('mongoose');

const partyRoomSchema = new mongoose.Schema({
    partyRoomName:{
        type: String,
        required: true
    },
    partyRoomId:{
        type: String,
        required: true
    },
    partyRoomVideo:{
        type: String,
        required: true
    }
    //,partyVideoSize:{
    //    type: Number,
    //    required: true
    //}
});

const partyRoom = mongoose.model('partyRoom', partyRoomSchema)
module.exports = partyRoom;