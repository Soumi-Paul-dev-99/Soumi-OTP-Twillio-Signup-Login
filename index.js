const http = require ("http");
const app = require("./App");
const server = http.createServer(app);
const port = process.env.PORT || 5000


//SERVER LISTENING

server.listen(port ,()=>{
console.log(`server running on the port http://localhost:${port}`)
})
