const router = require('express').Router();
const partyRoom = require('../models/partyRoom');

router.post('/createRoom', (request, response) => {
    //let {partyRoomName, partyRoomId, partyVideoSize}  = request.body;
    let {partyRoomName, partyRoomId, partyRoomVideo}  = request.body;
    //console.log(partyRoomName, partyRoomId, partyVideoSize);
    //let createdPartyRoom = partyRoom({partyRoomName, partyRoomId, partyVideoSize});
    let createdPartyRoom = partyRoom({partyRoomName, partyRoomId, partyRoomVideo});
    createdPartyRoom.save()
    response.send({message:"room_created"});
});

router.post('/joinRoom', (request, response) => {
    // let {partyRoomId, partyVideoSize} = request.body;
    let {partyRoomId} = request.body;
    //console.log(partyRoomId, partyVideoSize);
    console.log(partyRoomId);
    partyRoom.findOne({partyRoomId}).then(partyRoomObj => {
        if(!partyRoomObj)
        {
            response.send({message:"Incorrect Room Id"});
        }
        else
        {
            /*if(partyRoomObj.partyVideoSize!=partyVideoSize)
            {
                response.send({message:"Host's Video is different"});
            }
            else*/
            //if(partyRoomObj.partyVideoSize!=partyVideoSize)
            //{
                // response.send({partyRoomId, partyVideoSize, partyRoomName: partyRoomObj.partyRoomName, message:"room_joined"});
                response.send({partyRoomId, partyRoomName: partyRoomObj.partyRoomName, partyRoomVideo: partyRoomObj.partyRoomVideo, message:"room_joined"});
            //}
        }
    })
});

module.exports = router;