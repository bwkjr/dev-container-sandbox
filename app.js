const express = require('express');
const app = express();
const shopifyService = require('./services/orders/orderByIdService');
const shipstationService = require('./services/fetchShipstationData');
require('dotenv').config();

// Example route to get a specific order by ID
app.get('/shopify-api/:orderId', async (req, res) => {
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
app.get('/shipstation-data', async (req, res) => {
  try {
      const shipstationData = await shipstationService.fetchShipStationData();
      res.json(shipstationData);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
