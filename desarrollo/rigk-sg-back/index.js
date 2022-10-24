require("dotenv").config();
const app = require("./app");
const server = require("http").Server(app);
server.listen(4001, () => {
    console.log("Server api run !!!");
});