import { createServer } from "http";
import app from "./app.js";


const server = createServer(app);

server.listen(3003, () => {
  console.log("Ride Service is running on port 3003");
});
