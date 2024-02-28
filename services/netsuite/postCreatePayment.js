const axios = require('axios');
const { builtinModules } = require('module');
const fs = require('fs').promises;
require('dotenv').config();

const NETSUITE_REST_API_URL = 'https://3950655.suitetalk.api.netsuite.com/services/rest';
const INVOICE_RECORD_URL = `${NETSUITE_REST_API_URL}/record/v1/invoice/`;

const makeInvoicePayment = async (accessToken, currentInvoice) => {
    try {
        // URL for making the invoice payment
        const paymentUrl = `${INVOICE_RECORD_URL}${currentInvoice}/!transform/customerPayment`;

        // JSON body for the request
        const requestBody = {
            account: 419,
        };

        // Make the authenticated request with the access token
        const response = await axios.post(paymentUrl, requestBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Log the response for debugging
        console.log(`Invoice Payment Response for Invoice ${currentInvoice}:`, response.data);

        // You can handle the response or return it as needed
        return response.data;
    } catch (error) {
        console.error(`Error making payment for Invoice ${currentInvoice}:`, error);
        throw error;
    }
};



module.exports = {
    makeInvoicePayment,
};
