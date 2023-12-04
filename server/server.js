const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

// New route to handle domain check
app.get('/api/check-domain', async (req, res) => {
    // Extract domain query parameter
    const { domain } = req.query;
    if (!domain) {
        return res.status(400).json({ error: 'Domain query parameter is required' });
    }

    // Split domain into name and suffix
    const [name, suffix] = domain.split('.').filter(Boolean);
    if (!name || !suffix) {
        return res.status(400).json({ error: 'Invalid domain format' });
    }

    try {
        // Call the WHOIS API
        const response = await axios.get(`https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`);
        // Send back the response from the WHOIS API
        res.json(response.data);
    } catch (error) {
        console.error('WHOIS API request failed:', error);
        res.status(500).json({ error: 'Failed to fetch domain data from WHOIS API' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Removed the 'import('open')' part for simplicity
});
