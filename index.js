const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let users = [];

const addUser = (account, socketId) => {
  !users.some((user) => user.sub === account.sub) &&
    users.push({ ...account, socketId });
  console.log(users);
};

io.on("connection", (socket) => {
  console.log(`user connected:${socket.id}`);
  socket.on("addUser", (account) => {
    addUser(account, socket.id);
    io.emit("getUsers", users);
  });
});
