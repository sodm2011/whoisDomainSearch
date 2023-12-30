const express = require('express');
const axios = require('axios');
const Domain = require('../models/domain'); // Import Mongoose model
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const router = express.Router();

const checkDomainAvailability = async (name, suffix) => {
    const response = await axios.get(`https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`);
      // Check if creation_datetime is a valid date string
    const isValidDate = (dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()); // getTime() returns NaN for invalid dates
    };

    const registrationDate = isValidDate(response.data.creation_datetime)
        ? new Date(response.data.creation_datetime)
        : null; // Set to null or a default value for invalid dates

    // Save result to MongoDB
    const domainEntry = new Domain({
      domain: response.data.domain,
      registered: !response.data.available,
      registrationDate: registrationDate,
      whoisInfo: response.data.info
    });
  
    await domainEntry.save();
  
    return response.data;
  };

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
        const response = await checkDomainAvailability(name, suffix);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch domain data from WHOIS API' });
    }
});

// New POST route to handle multiple domain checks
router.post('/api/check-multiple-domains', async (req, res) => {
    const { baseDomain, suffixes } = req.body;
  
    try {
        const results = await Promise.all(suffixes.map(async suffix => {
            const cleanSuffix = suffix.replace(/^\./, ''); // Remove leading dot
            return await checkDomainAvailability(baseDomain, cleanSuffix);
        }));
        res.json(results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to perform multiple domain checks' });
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

// Route to call OpenAI API
router.post('/api/generate-domains', async (req, res) => {
    try {
      const { description, seedWords } = req.body;
  
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "Generate exactly creative domain names based on website description and seed words."
          },
          {
            "role": "user",
            "content": `Website description: ${description}\nSeed words: ${seedWords}.`
          }
        ],
        temperature: 0.8,
        max_tokens: 128,
        top_p: 1,
      });
  
      // Extract domain suggestions from response
      const suggestions = response.choices[0].message.content.split('\n').filter(s => s);
  
      res.json({ suggestions });
    } catch (error) {
      res.status(500).send('Failed to generate domain names');
    }
  });

// Root route
router.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;
