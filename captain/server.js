import { createServer } from "http";
import app from "./app.js";

const PORT = 3002;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Captain Service is running on port ${PORT}`);
});
