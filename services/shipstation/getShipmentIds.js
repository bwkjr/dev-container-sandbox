// GET Shipstation shipments
const axios = require('axios');
const pastRange = '2024-02-15';
const currentDate = '2024-02-16';
const shipStationUrl = 'https://ssapi.shipstation.com';

const getShipmentData = async () => {
    try {
        const response = await axios.get(`${shipStationUrl}/shipments?pageSize=500&createDateStart=${pastRange}&createDateEnd=${currentDate}`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`).toString('base64')}`,
            },
        });

        // Process the ShipStation API response
        return response.data;
        // log error if applicable 
    } catch (error) {
        console.error('Error fetching data from ShipStation:', error.message);
        throw new Error('Error fetching data from ShipStation');
    }
};



const getShipmentIds = async () => {
    try {
        const jsonData = await getShipmentData(); // Wait for the asynchronous call to complete
        let shipments = [];

        for (let ship in jsonData) {
            const SHIP = jsonData[ship];

            for (let shipment in SHIP) {
                const SHIPMENT = SHIP[shipment];

                shipments.push(SHIPMENT.orderId);
            }
        }

        console.log(shipments);
        return shipments; // Return the shipment IDs
    } catch (error) {
        console.error('Error getting shipment IDs:', error.message);
        throw error; // Rethrow the error for the route handler to catch
    }
};

module.exports = {
    getShipmentIds,
};
