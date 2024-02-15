// shipstationService.js
const axios = require('axios');
const pastRange = '2024-02-14';
const currentDate = '2024-02-15';
const shipStationUrl = 'https://ssapi.shipstation.com'; 

const fetchShipStationData = async () => {
    try {
        const response = await axios.get(`${shipStationUrl}/shipments?pageSize=500&createDateStart=${pastRange}&createDateEnd=${currentDate}`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`).toString('base64')}`,
            },
        });

        // Process the ShipStation API response
        return response.data;
    } catch (error) {
        console.error('Error fetching data from ShipStation:', error.message);
        throw new Error('Error fetching data from ShipStation');
    }
};

module.exports = {
    fetchShipStationData,
};
