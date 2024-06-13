const playground = document.querySelector(".playground");
const gridSize = 16;
const joinButton = document.getElementById("join-button");
let playerId;
let playerDot;
let playerPosition;
let ws;

const serverStatus = (param) => {
  const serverStatus = document.querySelector(".server-status");
  if (param == "online") {
    serverStatus.innerHTML = "Online. Hope on with your friend.";
    serverStatus.style.backgroundColor = "#2e8343";
  } else {
    serverStatus.innerHTML = "Offline. Check if the server is up and running.";
    serverStatus.style.backgroundColor = "#83312e";
  }
  setTimeout(() => {
    serverStatus.classList.add("hide-status");
  }, 3000);
};

const generateRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  };
};

const createNewDot = (id, position, color) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  dot.style.backgroundColor = color;
  dot.style.gridRow = position.y;
  dot.style.gridColumn = position.x;
  dot.setAttribute("data-id", id);
  playground.appendChild(dot);
  return dot;
};

const updateDotPosition = (dot, position) => {
  dot.style.gridRow = position.y;
  dot.style.gridColumn = position.x;
};

const joinGame = () => {
  playerId = `player-${Math.random().toString(36).substr(2, 9)}`;
  playerPosition = generateRandomPosition();
  const playerColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  playerDot = createNewDot(playerId, playerPosition, playerColor);

  ws.send(
    JSON.stringify({
      type: "join",
      id: playerId,
      position: playerPosition,
      color: playerColor,
    })
  );

  joinButton.style.display = "none";
};

// Function to handle dot movement
const move = (key) => {
  if (!playerDot) return;

  switch (key.code) {
    case "ArrowUp":
      if (playerPosition.y > 1) playerPosition.y -= 1;
      break;
    case "ArrowDown":
      if (playerPosition.y < gridSize) playerPosition.y += 1;
      break;
    case "ArrowLeft":
      if (playerPosition.x > 1) playerPosition.x -= 1;
      break;
    case "ArrowRight":
      if (playerPosition.x < gridSize) playerPosition.x += 1;
      break;
  }
  updateDotPosition(playerDot, playerPosition);
  ws.send(
    JSON.stringify({type: "move", id: playerId, position: playerPosition})
  );
};

// WebSocket connection
document.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    console.log("Connected to the server");
    serverStatus("online");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "init") {
      data.players.forEach((player) => {
        createNewDot(player.id, player.position, player.color);
      });
    } else if (data.type === "newPlayer") {
      createNewDot(data.player.id, data.player.position, data.player.color);
    } else if (data.type === "move") {
      const dot = document.querySelector(`[data-id='${data.id}']`);
      if (dot) {
        updateDotPosition(dot, data.position);
      }
    } else if (data.type === "removePlayer") {
      const dot = document.querySelector(`[data-id='${data.id}']`);
      if (dot) {
        dot.remove();
      }
    }
  };

  ws.onerror = () => {
    serverStatus("offline");
  };
});

joinButton.addEventListener("click", joinGame);
window.addEventListener("keydown", move);
