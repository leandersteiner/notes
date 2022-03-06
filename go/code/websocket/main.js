const ws = new WebSocket('ws://localhost:8080/ws');

const button = document.querySelector('button');
button.addEventListener('click', () => {
  ws.send(`Message from client ${Math.floor(Math.random() * 100)}`);
});

ws.onopen = () => {
  console.log('Connected!');
};

ws.onmessage = msg => {
  console.log(`Message received: ${msg.data}`);
};

ws.onclose = e => {
  if (e.wasClean) {
    console.log('Connection closed');
  }
};

ws.onerror = error => {
  console.log(`Socket Error: ${error}`);
};
