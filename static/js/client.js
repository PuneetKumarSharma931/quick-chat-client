const socket = io("http://localhost:3000");

let form = document.getElementById('sendContainer');
let message = document.getElementById('message');
let messageContainer = document.querySelector(".container");

let audioElement = new Audio('static/media/sound.mp3');

const name = prompt('Enter your name:');

socket.emit('new-user-joined', name);

const append = (user,message,position)=>{

    let chat = document.createElement('div');
    chat.classList.add('message');
    chat.classList.add(position);
    chat.innerHTML = `<strong>${user}</strong>: ${message}`;
    messageContainer.appendChild(chat);

    if(user!='You') {

        audioElement.play();
    }
}

const appendJoined = (user)=>{

    let chat = document.createElement('div');
    chat.classList.add('message');
    chat.classList.add('left');
    chat.innerHTML = `<strong>${user}</strong> joined the chat`;
    messageContainer.appendChild(chat);
    audioElement.play();
}

const appendLeft = (user)=>{

    let chat = document.createElement('div');
    chat.classList.add('message');
    chat.classList.add('left');
    chat.innerHTML = `<strong>${user}</strong> left the chat`;
    messageContainer.appendChild(chat);
    audioElement.play();
}

socket.on('user-joined', name=>{

    appendJoined(name);
});

form.addEventListener('submit', (e)=>{

    e.preventDefault();

    let messageInp = message.value;

    append('You',messageInp,'right');
    message.value = "";
    socket.emit('send', messageInp);
});

socket.on('received', data=>{

    append(data.name, data.message, 'left');
});

socket.on('left', name=>{

    appendLeft(name);
});



