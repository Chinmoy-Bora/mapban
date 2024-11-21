const socket = io();

document.getElementById('connectButton').addEventListener('click', () => {
    const poolId = document.getElementById('poolId').value;
    const userId = document.getElementById('userId').value;

    if (!poolId || !userId) {
        alert('Please enter both Pool ID and User ID');
        return;
    }

    // Emit the joinPool event to the backend
    socket.emit('joinPool', { poolId, userId });

    // Wait for responses from the server
    socket.on('connected', (data) => {
        document.getElementById('user-info').innerText = 
            `Connected to Pool: ${data.poolId}, User ID: ${data.userId}`;
        document.getElementById('map-container').style.display = 'block'; // Show the map banning buttons
    });

    socket.on('poolUpdate', (poolState) => {
        const { bannedMaps, currentTurn } = poolState;
        document.getElementById('banned-maps').innerText = `Banned Maps: ${bannedMaps.join(', ')}`;
        document.getElementById('turn-info').innerText = 
            `Current Turn: ${currentTurn}`;
        
        // Disable banned maps
        bannedMaps.forEach((map) => {
            const button = document.querySelector(`.map[data-map="${map}"]`);
            if (button) {
                button.disabled = true;
                button.classList.add('banned'); // Add a visual indicator
            }
        });
    });

    socket.on('mapBanned', (data) => {
        const { map, bannedBy, bannedMaps } = data;
        alert(`${map} banned by ${bannedBy}`);
        document.getElementById('banned-maps').innerText = `Banned Maps: ${bannedMaps.join(', ')}`;
        
        // Disable the banned map button
        const button = document.querySelector(`.map[data-map="${map}"]`);
        if (button) {
            button.disabled = true;
            button.classList.add('banned'); // Add a visual indicator
        }
    });

    socket.on('winnerDeclared', (data) => {
        const { winnerMap } = data;
        console.log(`Winner map: ${winnerMap}`);

        // Display the winner map
        alert(`The winner map is: ${winnerMap}`);
        document.getElementById('winner-info').innerText = `Winner Map: ${winnerMap}`;

        // Optionally, you can disable the map buttons after a winner is declared
        document.querySelectorAll('.map').forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
    });

    socket.on('error', (data) => {
        alert(data.message);
    });

    socket.on('disconnect', () => {
        alert('You have been disconnected.');
    });
});

// When a user clicks on a map to ban
document.querySelectorAll('.map').forEach((button) => {
    button.addEventListener('click', () => {
        const map = button.getAttribute('data-map');
        const poolId = document.getElementById('poolId').value;

        // Emit mapBan event
        socket.emit('mapBan', { poolId, map });
    });
});
