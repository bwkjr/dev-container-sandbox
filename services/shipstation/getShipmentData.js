// Import the Axios library for making HTTP requests
const axios = require('axios');
require('dotenv').config();
// Import configurations
const config = require('../../config');
const getFullfilmentOrderById = require('../shopify/getFulfillmentOrder');

// Set date range for ShipStation API request
const pastRange = '2024-02-19';
const currentDate = '2024-02-20';

// ShipStation API base URL
const shipStationUrl = 'https://ssapi.shipstation.com';

// Function to get ShipStation shipments
const getShipments = async () => {
    try {
        // Make a GET request to ShipStation API
        const response = await axios.get(
            `${shipStationUrl}/shipments?pageSize=500&createDateStart=${pastRange}&createDateEnd=${currentDate}`,
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`).toString('base64')}`,
                },
            }
        );

        // Process the ShipStation API response
        return response.data.shipments; 
    } catch (error) {
        // Log and handle errors
        console.error('Error fetching data from ShipStation:', error.message);
        throw new Error('Error fetching data from ShipStation');
    }
};

const getOrders = async (currentOrder) => {
    try {
        // Make a GET request to ShipStation API
        const response = await axios.get(
            `${shipStationUrl}/orders/${currentOrder}`,
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`).toString('base64')}`,
                },
            }
        );

        // Process the ShipStation API response
        return response.data.advancedOptions;
    } catch (error) {
        // Log and handle errors
        console.error('Error fetching data from ShipStation:', error.message);
        throw new Error('Error fetching data from ShipStation');
    }
};

////////////////////////////////////^^^Should Probably section off te above into another file

// Function to get ShipStation order IDs
const getShipmentData = async () => {
    try {
        // Call the getShipments function to retrieve ShipStation shipment data
        const jsonData = await getShipments();

        // Extract order IDs from the shipment data
        for (let shipment in jsonData) {

           let s = jsonData[shipment];
           let carrierCode = s.carrierCode;

           if (carrierCode == "fedex")
           {
               carrierCode = "FedEx";
           }
           else if (carrierCode == "stamps_com")
           {
               carrierCode = "USPS";
           }

            let currentOrder = s.orderId
            const orderData = await getOrders(currentOrder);
            let o = orderData;

            config.setOrderConfig({
                soNumber: s.orderNumber,
                trackingNumber: s.trackingNumber,
                carrierCode: carrierCode,
                orderId: s.orderId,
                shopifyOrderId: o.customField3,
                shopifyOrderNumber: o.customField2,
                source: o.customField1
            })

            await getFullfilmentOrderById.getFulfillmentOrderById();
            break;   ///REMOVEEEEEEEEEE just here for testing

        }

    } catch (error) {
        // Log and rethrow errors for the route handler to catch
        console.error('Error getting shipment IDs:', error.message);
        throw error;
    }
};

// Export the function for external use
module.exports = {
    getShipmentData,
};
