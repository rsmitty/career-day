import './style.css';
import './app.css';

import logo from './assets/images/summit-eagle.png';
import {ComputerID} from '../wailsjs/go/main/App';
import {SendMsg} from '../wailsjs/go/main/App';

document.querySelector('#app').innerHTML = `
    <h1 id="computer"></h1>
    <img id="logo" class="logo">
      <div class="result" id="result">Type a message to send to the other computer! 👇</div>
      <div class="input-box" id="input">
        <input class="input" id="msgInput" type="text" autocomplete="off" />
        <button class="btn" onclick="sendMsg();reset();">Send</button>
      </div>
      <div class="message-box" id="message-box">
      <div class="result" id="result">Incoming Messages:</div>
        <p id="message" style="color: green"></p>
      </div>
    </div>
`;
document.getElementById('logo').src = logo;

let msgInputElement = document.getElementById("msgInput");
msgInputElement.focus();

window.reset = function() {
    msgInputElement.value = "";
}

window.computerName = function() {
    let computerID = document.getElementById("computer");
    try {
        ComputerID()
            .then((result) => {
                // Update result with data back from App.Greet()
                computerID.innerText = result;
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
}()

window.sendMsg = function () {
    let msgToSend = msgInputElement.value;

    if (msgToSend === "") return;

    try {
        SendMsg(msgToSend)
    } catch (err) {
        console.error(err);
    }
}

window.receivedFromPeer = function (message) {
    console.log(message)
    const parsedMessage = JSON.parse(message)

    let messageBox = document.getElementById("message");
    messageBox.innerText=parsedMessage.Message
}

runtime.EventsOn("hello_received", receivedFromPeer);
