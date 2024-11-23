const socket = io();

// Map details
const maps = [
    { name: "Ascent", image: "https://valorantinfo.gg/wp-content/uploads/2021/09/valorant-ascent-map-loading-screen.jpg" },
    { name: "Bind", image: "https://valorantinfo.gg/wp-content/uploads/2021/09/valorant-bind-map-loading-screen.jpg" },
    { name: "Breeze", image: "https://valorantinfo.gg/wp-content/uploads/2021/09/valorant-breeze-map-loading-screen.jpg" },
    { name: "Fracture", image: "https://valorantinfo.gg/wp-content/uploads/2021/09/valorant-fracture-map-loading-screen.jpg" },
    { name: "Haven", image: "https://valorantinfo.gg/wp-content/uploads/2021/09/valorant-haven-map-loading-screen.jpg" },
    { name: "Split", image: "https://valorantinfo.gg/wp-content/uploads/2021/09/valorant-split-map-loading-screen.jpg" },
];

// Render maps
// function renderMaps() {
//     const mapContainer = document.getElementById("map-container");
//     mapContainer.innerHTML = ""; // Clear previous content

//     maps.forEach((map) => {
//         const mapElement = document.createElement("button");
//         mapElement.className = "map";
//         mapElement.dataset.map = map.name;
//         mapElement.innerHTML = `
//             <img src="${map.image}" alt="${map.name}" />
//             <span>${map.name}</span>
//         `;

//         // Add click listener to ban map
//         mapElement.addEventListener("click", () => {
//             const poolId = document.getElementById("poolId").value;
//             socket.emit("mapBan", { poolId, map: map.name });
//         });

//         mapContainer.appendChild(mapElement);
//     });
// }

function renderMaps() {
    const mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = ""; // Clear previous content

    maps.forEach((map) => {
        // Create a new button element for each map
        const mapElement = document.createElement("button");
        mapElement.className = "map";
        mapElement.dataset.map = map.name; // Set data-map attribute with map name

        // Set button content: an image and a name
        mapElement.innerHTML = `
            <img src="${map.image}" alt="${map.name}" />
            <span>${map.name}</span>
        `;

        // Add event listener to handle map ban when button is clicked
        mapElement.addEventListener("click", () => {
            const poolId = document.getElementById("poolId").value; // Get pool ID
            socket.emit("mapBan", { poolId, map: map.name }); // Emit map ban event
        });

        // Append the map button to the map container
        mapContainer.appendChild(mapElement);
    });
}
// Join pool logic
document.getElementById("connectButton").addEventListener("click", () => {
    const poolId = document.getElementById("poolId").value;
    const userId = document.getElementById("userId").value;

    if (!poolId || !userId) {
        alert("Please enter both Pool ID and User ID");
        return;
    }

    socket.emit("joinPool", { poolId, userId });

    socket.on("connected", (data) => {
        document.getElementById("teamInputContainer").classList.add("hidden");
        document.getElementById("gameContainer").classList.remove("hidden");
        document.getElementById("user-info").innerText = 
            `${data.userId}`;
        renderMaps();
    });

    socket.on("poolUpdate", (poolState) => {
        const { bannedMaps, currentTurn } = poolState;
        // document.getElementById("banned-maps").innerText = `Banned Maps: ${bannedMaps.join(", ")}`;
        document.getElementById("turn-info").innerText = `Current Turn: ${currentTurn}`;
        

        // Disable banned maps
        bannedMaps.forEach((map) => {
            const button = document.querySelector(`.map[data-map="${map}"]`);
            if (button) {
                button.disabled = true;
                button.classList.add("banned");
            }
        });
    });

    socket.on("mapBanned", (data) => {
        const { map, bannedBy, bannedMaps } = data;
        alert(`${map} banned by ${bannedBy}`);
        document.getElementById("banned-maps").innerText = `Banned Maps: ${bannedMaps.join(", ")}`;

        const button = document.querySelector(`.map[data-map="${map}"]`);
        if (button) {
            button.disabled = true;
            button.classList.add("banned");
        }
    });

    socket.on("winnerDeclared", (data) => {
        const { winnerMap } = data;
        alert(`The winner map is: ${winnerMap}`);
        document.getElementById("winner-info").innerText = `Winner Map: ${winnerMap}`;

        document.querySelectorAll(".map").forEach((button) => {
            button.disabled = true;
            button.classList.add("disabled");
        });
    });

    socket.on("error", (data) => {
        alert(data.message);
    });

    socket.on("disconnect", () => {
        alert("You have been disconnected.");
    });
});
