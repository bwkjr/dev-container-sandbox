const Shopify = require('shopify-api-node');

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
  getOrderById: async function (orderId) {
    try {
      const shopify = this.createShopifyInstance();

      // Fetch the specific order by ID
      const order = await shopify.order.get(orderId);

      return order;
    } catch (error) {
      console.error('Error fetching the order by ID from Shopify:', error.message);
      throw new Error('Internal Server Error');
    }
  }
};
