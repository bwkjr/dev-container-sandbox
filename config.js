// config.js

let orderConfig = {
  soNumber: null,
  trackingNumber: null,
  carrierCode: null,
  orderId: null,
  shopifyOrderId: null,
  shopifyOrderNumber: null,
  source: null
};

module.exports = {
  getOrderConfig: () => ({ ...orderConfig }), // Return a copy to prevent direct modifications
  setOrderConfig: (newConfig) => {
      orderConfig = { ...orderConfig, ...newConfig };
      console.log('Updated orderConfig:', orderConfig); // Add a log statement to check the updated configuration
  },
};