require('dotenv').config();
require('./giga');
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { initSupportChat } = require('./socket/supportChat');

const PORT = process.env.PORT || 3000;
const rawOrigins = process.env.SOCKET_ALLOWED_ORIGINS;

const server = http.createServer(app);

const corsOrigins = rawOrigins
  ? rawOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : '*';
const corsCredentials = Array.isArray(corsOrigins);

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    credentials: corsCredentials,
  },
});

initSupportChat(io);

server.listen(PORT, (error) => {
  console.log(`Server is running on port ${PORT}`);
  if (error) {
    console.log(`Error - ${error}`);
  }
});

module.exports = {
  io,
  server,
};
