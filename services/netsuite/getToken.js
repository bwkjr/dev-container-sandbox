const axios = require('axios');
const jwt = require('jsonwebtoken');
const qs = require('querystring'); // Add this line for query string formatting
const fs = require('fs').promises;
require('dotenv').config();

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const NETSUITE_REST_API_URL = 'https://3950655.suitetalk.api.netsuite.com/services/rest';

const getToken = async () => {
    try {
        // Load the private key from a PEM file
        const privateKey = await fs.readFile('./sw202_key.pem', 'utf-8');

        // Create JWT header
        const jwtHeader = {
            alg: 'PS256',
            typ: 'JWT',
            kid: '6n3I6_sfuE4GfAfHhK4Gop1tXhHVlfWU_QIZB6ckyrE'
        };

        // Create JWT payload
        const jwtPayload = {
            iss: CONSUMER_KEY,
            scope: ['restlets', 'rest_webservices'],
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
            aud: 'https://3950655.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token'
        };

        // Sign the JWT with the PS256 algorithm
        const signedJWT = jwt.sign(jwtPayload, privateKey, { algorithm: 'PS256', header: jwtHeader });

        // Convert the parameters to a query string
        const params = qs.stringify({
            grant_type: 'client_credentials',
            client_id: CONSUMER_KEY,
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            client_assertion: signedJWT,
        });

        // Log the full request parameters before making the request
        console.log('Making Token Request with Parameters:', params);

        // Make the OAuth 2.0 token request
        console.log('Making Token Request...');
        const response = await axios.post(`${NETSUITE_REST_API_URL}/auth/oauth2/v1/token`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Log the response for debugging
        console.log('Token Request Response:', response.data);

        // Extract the access token
        const accessToken = response.data.access_token;

        // Log success
        console.log('Access Token:', accessToken);

        return accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
};

// Replace with your actual NetSuite REST API URL and access token
const apiUrl = 'https://3950655.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=841&deploy=3&limit=639';
const testNetsuite = async () => {
  
  accessToken = await getToken();

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // Replace with the actual search ID and any additional parameters if needed
    const searchID = 'customsearch638';

    // Make the GET request to the NetSuite REST API
    const response = await axios.get(apiUrl, {
      params: {
        searchID: searchID,
      },
      headers: config.headers,
    });

    // Return the API response data
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error making API call:', error.message);
    throw error;
  }
};

module.exports = {
    getToken,
    testNetsuite,

};





