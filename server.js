const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'ActDraw game server is running!' });
});

app.listen(PORT, () => {
    console.log(`🎮 SkribbleAct game server running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to the URL above to play!`);
});
