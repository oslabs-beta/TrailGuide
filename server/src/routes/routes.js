const express = require('express');
const router = express.Router();
const AWS = require('../config/awsConfig');

const cloudtrail = new AWS.CloudTrail();

router.get('/cloudtrail/events', (req, res) => {
  //Assume the frontend will use http://localhost:3000/api/cloudtrail/events

  //we can use filters on lookupEvents
  //When a GET request is made to this endpoint, it calls CloudTrail’s lookupEvents method. This method retrieves CloudTrail events (API activity logs) within the AWS account.
  //MaxResults: 5: Limits the response to the 5 most recent events.
  cloudtrail.lookupEvents({ MaxResults: 5 }, (err, data) => {
    if (err) {
      console.error('Error fetching CloudTrail events', err);
      return res
        .status(500)
        .json({ error: 'Failed to fetch CloudTrail events' });
    }
    //If the request is successful, it returns the events in JSON format as the response.
    res.json(data.Events);
  });
});

router.post('/cloudtrail/submit', (req, res) => {
  res.send('POST request to /cloudtrail.submit');
});

module.exports = router;
