const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8000, host : '192.168.0.108'});

const clients = new Map();

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({
    conection:"true",
    isfirst:"true",
    cmd:"Request_device"
  }));

  const id = uuidv4();
  var device;

  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);
    if(message.isfirst == "true"){
      device = message.device;
      const metadata = {id, device};
      clients.set(ws, metadata); 
      console.log(device);
      ws.send(JSON.stringify({
        conection:"true"
      }));
    }
  });

  ws.on("close", () => {
    ws.send(JSON.stringify({
      conection:"lost"
    }));
    clients.delete(ws);
    console.log(device + " lost conection");
  });
})

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log("wss up");