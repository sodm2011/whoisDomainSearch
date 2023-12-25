const express = require('express');
const axios = require('axios');
const Domain = require('../models/domain'); // Import Mongoose model

const router = express.Router();

// New route to handle domain check
router.get('/api/check-domain', async (req, res) => {
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
        // Save result to MongoDB
        const domainEntry = new Domain({
            domain: response.data.domain,
            registered: !response.data.available,
            registrationDate: new Date(response.data.creation_datetime),
            whoisInfo: response.data.info
        })
        
        await domainEntry.save()

        // Send back the response from the WHOIS API
        res.json(response.data);
        
    } catch (error) {
        console.error('WHOIS API request failed:', error);
        res.status(500).json({ error: 'Failed to fetch domain data from WHOIS API' });
    }
});

// Route to get recent queries
router.get('/api/recent-domains', async (req, res) => {
    try {
      const recentDomains = await Domain.find().sort({ queryDate: -1 }).limit(20);
      res.json(recentDomains);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recent domains' });
    }
  });

// Root route
router.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;
