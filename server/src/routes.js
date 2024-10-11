import express from 'express';
import AWS from '../config/awsConfig.js';

const router = express.Router();
const cloudtrail = new AWS.CloudTrail();

//Assume the frontend will use http://localhost:3000/api/cloudtrail/events

//we can use filters on lookupEvents
//When a GET request is made to this endpoint, it calls CloudTrail’s lookupEvents method. This method retrieves CloudTrail events (API activity logs) within the AWS account.
//MaxResults: 5: Limits the response to the 5 most recent events.

router.get('/cloudtrail/events', async (req, res) => {
  try {
    const params = { MaxResults: 5 };
    const data = await cloudtrail.lookupEvents(params).promise();
    res.json(data.Events);
  } catch (err) {
    console.error('Error fetching CloudTrail events:', err);
    res.status(500).json({ error: 'Failed to fetch CloudTrail events' });
  }
});

router.post('/cloudtrail/submit', (req, res) => {
  res.send('POST request to /cloudtrail/submit');
});

module.exports = router;
