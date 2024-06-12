const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 8080});

let players = [];

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({type: "init", players}));

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "join") {
      if (players.some((player) => player.id === data.id)) {
        ws.send(JSON.stringify({type: "error", message: "ID already exists"}));
        return;
      }

      const newPlayer = {
        id: data.id,
        position: data.position,
        color: data.color,
        ws: ws,
      };
      players.push(newPlayer);

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({type: "newPlayer", player: newPlayer}));
        }
      });
    } else if (data.type === "move") {
      const player = players.find((p) => p.id === data.id);
      if (player) {
        player.position = data.position;

        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "move",
                id: player.id,
                position: player.position,
              })
            );
          }
        });
      }
    }
  });

  ws.on("close", () => {
    const playerIndex = players.findIndex((player) => player.ws === ws);
    if (playerIndex !== -1) {
      const removedPlayer = players.splice(playerIndex, 1)[0];

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({type: "removePlayer", id: removedPlayer.id})
          );
        }
      });
    }
  });
});

console.log("Server is running on ws://localhost:8080");
