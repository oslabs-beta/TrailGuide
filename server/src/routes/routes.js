const express = require('express');
const router = express.Router()
const AWS = require('./config/awsConfig');

const cloudtrail = new AWS.CloudTrail();


router.get('/cloudtrail/events', (req, res) => {
//Assume the frontend will use http://localhost:3000/api/cloudtrail/events


//we can use filters on lookupEvents
cloudtrail.lookupEvents({ MaxResults: 5 }, (err, data) => {
    if (err) {
      console.error("Error fetching CloudTrail events", err);
      return res.status(500).json({ error: 'Failed to fetch CloudTrail events' });
    }

res.json(data.Events);
});
});

router.post('/cloudtrail/submit', (req, res) => {
    res.send('POST request to /clouydtrail.submit');
});

module.exports = router;
