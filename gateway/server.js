import express from "express";
import proxy from "express-http-proxy";

const app = express();

const PORT = process.env.GATEWAY_PORT || 3000;
const SERVICES = {
  user: process.env.USER_SERVICE || "http://localhost:3001",
  captain: process.env.CAPTAIN_SERVICE || "http://localhost:3002",
  ride: process.env.RIDE_SERVICE || "http://localhost:3003",
};

app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

function createServiceProxy(mountPath, target) {
  return proxy(target, {
    proxyReqPathResolver: (req) => {
      // remove mountPath prefix from the proxied path
      const newPath =
        req.originalUrl.replace(new RegExp(`^${mountPath}`), "") || "/";
      return newPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // forward some useful headers
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      proxyReqOpts.headers["x-forwarded-host"] = srcReq.headers.host;
      proxyReqOpts.headers["x-forwarded-for"] =
        srcReq.ip || srcReq.connection.remoteAddress;
      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error(
        `Error while proxying ${mountPath} -> ${target}:`,
        err && err.message ? err.message : err,
      );
      if (!res.headersSent) {
        res.status(502).json({ error: "Bad gateway" });
      }
    },
    timeout: 10000,
  });
}

app.use("/user", createServiceProxy("/user", SERVICES.user));
app.use("/captain", createServiceProxy("/captain", SERVICES.captain));
app.use("/ride", createServiceProxy("/ride", SERVICES.ride));

// Health endpoint for orchestrators / load balancers
app.get("/health", (req, res) => {
  res.json({ status: "ok", services: SERVICES });
});

const server = app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down...`);
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Forcing shutdown");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
