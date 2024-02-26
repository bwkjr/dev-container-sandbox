require('dotenv').config();
const express = require('express');
const app = express();
const shopifyService = require('./services/shopify/getOrderByID');
const shipstationService = require('./services/shipstation/getShipmentData');
const netsuiteService = require('./services/netsuite/restletRequest');
require('dotenv').config();
const config = require('./config');

// Example route to get a specific order by ID
app.get('/order-data/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Call the service function to get the order by ID
    const order = await shopifyService.getOrderById(orderId);

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example route to get shipstation data
app.get('/shipment-data', async (req, res) => {
  try {
      const shipmentData = await shipstationService.getShipmentData();
      res.json(shipmentData);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/restlet', async (req, res) => {
  try {
    console.log('CONSUMER_KEY:', process.env.CONSUMER_KEY);
    const searchID = 'customsearch638'; // Replace with your actual searchID
    const test = await netsuiteService.callRestlet(searchID);
    res.json(test);
  } catch (error) {
    console.error('Error making api call:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
