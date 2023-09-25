// import messagesManagerDB from '../../dao/models/messages.manager.js';
// const messagesManagerDB = require('../../dao/models/messages.manager.js');


// const messageManager = new messagesManagerDB();

const socket = io();
const chatBox = document.getElementById("chatBox")
let user = "Hernan";
chatBox.addEventListener("keyup", e=> {
    if(e.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            let message = chatBox.value;
            // messageManager.addMessage(user, message )
            socket.emit("message", {user: user, message: message});
            chatBox.value = "";
        }
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message}<br/>`
    })
    log.innerHTML = messages;
})


// socket.emit("message", messages)
// socket.on("messageLogs", (data) => {
//     console.log("soy los msg", data);
// })
