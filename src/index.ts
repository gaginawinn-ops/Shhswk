import { createServer } from "http";
import app from "./app.js";
import { logger } from "./lib/logger.js";
import { createSocketServer } from "./lib/socketServer.js";

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

const httpServer = createServer(app);
createSocketServer(httpServer);
httpServer.listen(port, () => { logger.info({ port }, "Server listening with Socket.io"); });
