import { createServer } from "http";
import app from "./app.js";

const PORT = 3001;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});
