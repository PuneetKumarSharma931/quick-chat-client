const socket = io("https://quick-chat-socket-server.herokuapp.com");

let form = document.getElementById('sendContainer');
let message = document.getElementById('message');
let messageContainer = document.querySelector(".container");
let sendBtn = document.getElementsByClassName('btn')[0];

let audioElement = new Audio('static/media/sound.mp3');

const popup = document.getElementsByClassName('popup')[0];
const join = document.getElementsByClassName('joinBtn')[0];
const input = document.getElementById('name');
const chats = document.getElementsByClassName('chatRoom')[0];
let name;

const getName = new Promise((resolve, reject) => {

    window.onload = () => {

        popup.style.display = 'block';
        chats.classList.toggle('active');

        join.disabled = true;

        input.addEventListener('input', ()=>{

            if(input.value.length<=1) {

                join.disabled = true;
            }
            else{

                join.disabled = false;
            }
        });

        join.addEventListener('click', () => {

            name = input.value;
            popup.style.display = 'none';
            chats.classList.toggle('active');
        });

    }

    setInterval(() => {
        
        if(name!=undefined)
        resolve();

    }, 200);
});


getName.then(() => {
    socket.emit('new-user-joined', name);
}).catch(() => {
    console.log("Some Error Occured!");
});

const append = (user, message, position) => {

    let chat = document.createElement('div');
    chat.classList.add('message');
    chat.classList.add(position);
    chat.innerHTML = `<strong>${user}</strong>: ${message}`;
    messageContainer.appendChild(chat);

    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (user != 'You') {

        audioElement.play();
    }
}

const appendJoined = (user) => {

    let chat = document.createElement('div');
    chat.classList.add('message');
    chat.classList.add('left');
    chat.innerHTML = `<strong>${user}</strong> joined the chat`;
    messageContainer.appendChild(chat);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    audioElement.play();
}

const appendLeft = (user) => {

    let chat = document.createElement('div');
    chat.classList.add('message');
    chat.classList.add('left');
    chat.innerHTML = `<strong>${user}</strong> left the chat`;
    messageContainer.appendChild(chat);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    audioElement.play();
}

socket.on('user-joined', name => {

    appendJoined(name);
});

form.addEventListener('submit', (e) => {

    e.preventDefault();

    let messageInp = message.value;

    append('You', messageInp, 'right');
    message.value = "";
    socket.emit('send', messageInp);

    sendBtn.disabled = true;
});

socket.on('received', data => {

    append(data.name, data.message, 'left');
});

socket.on('left', name => {

    appendLeft(name);
});

sendBtn.disabled = true;

message.addEventListener('input',()=>{

    if(message.value.length===0) {

        sendBtn.disabled = true;
    }
    else{

        sendBtn.disabled = false;
    }
});



