const net = require('net');
const register = require('register-multicast-dns');
const jsonStream = require('duplex-json-stream');
const streamSet = require('stream-set');

const host = process.argv[2];
const port = process.argv[3];

register(host);

const activeSockets = streamSet();

const server = net.createServer(function (socket) {
  const jsonSocket = jsonStream(socket);
  activeSockets.add(jsonSocket);
  jsonSocket.on('data', function ({ nick, msg, }) {
    activeSockets.forEach(function (s) {
      if (s !== jsonSocket) {
        s.write(`${nick}> ${msg}`);
      }
    });
  });
});

server.listen(port, host);
