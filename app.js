// Import required modules
const express = require('express');
const app = express();
const Shopify = require('shopify-api-node');
require('dotenv').config();

// Your Shopify API credentials
const shopify = new Shopify({
  shopName: process.env.shopName,
  apiKey: process.env.apiKey,
  password: process.env.accessToken
});

// Example route to get the most recent unfulfilled order
app.get('/shopify-api', async (req, res) => {
  try {
    // Make an API call to get the most recent unfulfilled order
    const orders = await shopify.order.list({
      limit: 1,
      status: 'open',
      fulfillment_status: 'unfulfilled',
      order: 'created_at desc'
    });

    // Extract relevant data from the response
    const order = orders[0];

    // Send the order as a JSON response
    res.json({ order });
  } catch (error) {
    console.error('Error fetching the most recent unfulfilled order from Shopify:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
