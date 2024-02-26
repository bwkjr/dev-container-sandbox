// 1. **Load Dependencies:**
//    - `axios`: Essential for making HTTP requests to NetSuite's REST API.
//    - `jwt`: Used for creating a JSON Web Token (JWT), a secure way to pass information between parties.
//    - `fs.promises`: Required to read the private key from a PEM file.
//    - `qs`: Necessary for encoding parameters in the request.

// 2. **Load Environment Variables:**
//    - Load environment variables, including `CONSUMER_KEY`, from a `.env` file. `CONSUMER_KEY` is a crucial identifier for the NetSuite integration.

// 3. **Create JWT Header and Payload:**
//    - JWT is commonly used in authentication processes. Here, it includes information like `CONSUMER_KEY`, scopes (`restlets`, `rest_webservices`), and timestamps for security.
//    - Scopes define the level of access the integration has within NetSuite.

// 4. **Sign the JWT:**
//    - The private key is crucial for creating a secure JWT. This key is generated during the NetSuite integration setup and is known only to the integration and NetSuite.
//    - The `PS256` algorithm is specified, indicating that NetSuite expects a JWT signed using the RSA-PSS algorithm.

// 5. **Encode Parameters for Request:**
//    - Use the `qs` library to encode parameters. These parameters include the grant type (`client_credentials`), client ID (`CONSUMER_KEY`), and the signed JWT (client assertion).

// 6. **Make OAuth 2.0 Token Request:**
//    - `axios` is employed to send a POST request to NetSuite's OAuth 2.0 token endpoint (`/auth/oauth2/v1/token`).
//    - The request includes the encoded parameters in the body, conforming to the OAuth 2.0 specification.

// 7. **Handle Response:**
//    - Log the response for debugging purposes. This step provides insight into the HTTP response status, headers, and data.
//    - Extract the access token from the response data. The access token is a time-limited credential used to authenticate subsequent NetSuite API requests.

// 8. **Logging and Error Handling:**
//    - Log various steps for debugging purposes, aiding in identifying potential issues.
//    - Handle errors appropriately, logging details for debugging and rethrowing the error. Error messages, such as a `400 Bad Request`, indicate potential issues in the request.

// 9. **Return Access Token:**
//    - Return the obtained access token, allowing external modules to use it for making authenticated requests to NetSuite's REST API.

// 10. **Module Export:**
//     - Export the `getToken` function to make it available for use in other parts of the application. This modular approach encourages code organization and reusability.

// This code snippet is a fundamental part of integrating with NetSuite, providing a secure and authenticated means to obtain access tokens for subsequent API interactions. 
//It aligns with NetSuite's security practices, ensuring that only authorized integrations can access the specified scopes within the NetSuite account.

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



////test

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




////
module.exports = {
    getToken,
    testNetsuite,

};





