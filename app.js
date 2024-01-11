const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

const wsServer = new WebSocket.Server({ server: httpServer });

// array of connected websocket clients
const clients = new Set();

wsServer.on('connection', (ws) => {
	// Add the client to the set of connected clients
	clients.add(ws);

	// When data is received from the broadcasting client
	ws.on('message', (data) => {

		const response = safeJsonParse(data);


		console.log(typeof response,'get response');
		
			for (const client of clients) {
				// Skip the broadcasting client itself
				if (client !== ws) {
						if(response == undefined){
							client.send(data);
						}else{
							client.send(JSON.stringify(response));

						}
				}
			}
	});

	

	// When the WebSocket connection is closed
	ws.on('close', () => {
		// Remove the client from the set of connected clients
		clients.delete(ws);
	});
});



app.get('/', (req, res) => {
	res.send(`
        <a>Socket homepage</a><br>
        <a href="client">Connected to websocke server</a>
    `);
});
httpServer.listen(PORT, () => console.log(`HTTP server listening at http://localhost:${PORT}`));



const safeJsonParse = (str) => {
	try {
		const jsonValue = JSON.parse(str);

		return jsonValue;
	} catch {
		return undefined;
	}
};