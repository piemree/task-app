import { createServer } from "node:http";
import app from "./app";
import config from "./config/config";
import { setupSocket } from "./config/socket";
const server = createServer(app);

setupSocket(server);

server.listen(config.port, () => {
	console.log(`Server running on ${config.apiUrl} in ${config.nodeEnv} mode`);
	console.log(`OpenAPI document: ${config.apiUrl}/docs`);
});
