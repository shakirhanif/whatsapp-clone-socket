const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;
const io = new Server(PORT, {
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

const getUser = (userId) => {
  const myUser = users.find((user) => user.sub === userId);
  return myUser;
};

io.on("connection", (socket) => {
  console.log(`user connected:${socket.id}`);
  socket.on("addUser", (account) => {
    addUser(account, socket.id);
    io.emit("getUsers", users);
  });
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    io.to(user.socketId).emit("getMessage", data);
  });
});
