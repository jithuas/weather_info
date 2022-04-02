/**
 * Configure ENV
 */
require('dotenv').config();

/**
 * Get server
 */
const server = require('./src/server');

const PORT = process.env.PORT || 8080;

/**
 * Start server
 */
server.listen(PORT, () => console.log(`Server is started on localhost:${PORT}`));