const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('./config/database');
const Pool = require('./models/pool');
const apiRoutes = require('./routes/api');
const config = require('./config/serverConfig');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', apiRoutes);

// Database sync
sequelize.sync({ force: true }).then(() => console.log('Database synced.'));

// Store active pool states
const poolState = {}; // { poolId: { bannedMaps: [], currentTurn: 'userId' } }

// Socket connection
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle joining a pool
    socket.on('joinPool', async ({ poolId, userId }) => {
        console.log(`User ${userId} joining pool ${poolId}`);
        try {
            const pool = await Pool.findOne({ where: { poolId } });

            if (!pool || (pool.user1Id !== userId && pool.user2Id !== userId)) {
                socket.emit('error', { message: 'Invalid pool or token' });
                return;
            }

            socket.join(poolId);

            // Initialize pool state if not already initialized
            if (!poolState[poolId]) {
                poolState[poolId] = {
                    bannedMaps: [],
                    currentTurn: pool.user1Id, // User1 starts
                    user1Id: pool.user1Id,
                    user2Id: pool.user2Id
                };
            }

            socket.data.poolId = poolId;
            socket.data.userId = userId;

            socket.emit('connected', { poolId, userId });
            io.to(poolId).emit('poolUpdate', {
                bannedMaps: poolState[poolId].bannedMaps,
                currentTurn: poolState[poolId].currentTurn,
            });
        } catch (error) {
            console.error('Error in joinPool:', error);
            socket.emit('error', { message: 'An error occurred while joining the pool.' });
        }
    });

    // Handle map banning
    socket.on('mapBan', ({ poolId, map }) => {
        try {
            const pool = poolState[poolId];

            // Validate pool existence
            if (!pool) {
                socket.emit('error', { message: 'Pool not found.' });
                return;
            }

            // Check if it's the user's turn
            if (socket.data.userId !== pool.currentTurn) {
                socket.emit('error', { message: "It's not your turn to ban a map." });
                return;
            }

            // Check if the map is already banned
            if (pool.bannedMaps.includes(map)) {
                socket.emit('error', { message: 'This map is already banned.' });
                return;
            }

            // Ban the map
            pool.bannedMaps.push(map);

            // Alternate the turn
            pool.currentTurn = pool.currentTurn === pool.user1Id ? pool.user2Id : pool.user1Id;

            // Check if only one map is left unbanned
            const allMaps = ['Map 1', 'Map 2', 'Map 3', 'Map 4']; // Replace with your actual map list
            const remainingMaps = allMaps.filter(map => !pool.bannedMaps.includes(map));

            if (remainingMaps.length === 1) {
                const winnerMap = remainingMaps[0];
                io.to(poolId).emit('winnerDeclared', { winnerMap });
                console.log(`Winner Map: ${winnerMap}`);
            }

            // Broadcast the updated pool state to all users
            io.to(poolId).emit('poolUpdate', {
                bannedMaps: pool.bannedMaps,
                currentTurn: pool.currentTurn,
            });

            console.log(`Map "${map}" banned by ${socket.data.userId}`);
            console.log('Updated Pool State:', poolState[poolId]);
        } catch (error) {
            console.error('Error in mapBan:', error);
            socket.emit('error', { message: 'An error occurred while banning the map.' });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// API route to create a new pool
app.post('/api/create-pool', async (req, res) => {
    const { user1Id, user2Id } = req.body;
    const poolId = uuidv4(); // Generate a unique pool ID

    try {
        const pool = await Pool.create({ poolId, user1Id, user2Id });
        console.log(`Pool Created! ID: ${pool.poolId}`);
        res.status(201).json(pool);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

server.listen(config.PORT, () =>
    console.log(`Server running on port ${config.PORT}`)
);
