const Shopify = require('shopify-api-node');
const config = require('../../config');

module.exports = {
  // Function to create a Shopify instance
  createShopifyInstance: function () {
    return new Shopify({
      shopName: process.env.shopName,
      apiKey: process.env.apiKey,
      password: process.env.accessToken
    });
  },

  // Function to get an order by its ID
  getFulfillmentOrderById: async function () {
    try {
      const shopify = this.createShopifyInstance();
     let currentOrder = config.getOrderConfig().shopifyOrderId;
      // Fetch the specific order by ID
      const fulfillmentOrder = await shopify.order.fulfillmentOrders(currentOrder);
      console.log(fulfillmentOrder);
      return fulfillmentOrder;
    }  catch (error) {
      if (error.statusCode === 404) {
          console.error('Fulfillment order not found. Order ID:', currentOrder);
      } else {
          console.error('Error fetching the order by ID from Shopify:', error);
      }
      throw new Error('Internal Server Error');
  }
  
  }
};