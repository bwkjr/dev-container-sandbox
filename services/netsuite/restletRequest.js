
// REFERENCES
// https://stackoverflow.com/questions/77595304/403-error-while-calling-netsuite-restlet-from-node-js  (Thank the lord for this person...)
// Create the following suitescript in Netsuite (by Tim Dietrich)
// https://timdietrich.me/blog/netsuite-saved-search-api/ (This dude is a legend...)
// Some more Netsuite docs
// https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N2971402.html#Authentication-for-RESTlets

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

const REALM = process.env.REALM; // Netsuite acount ID
const CONSUMER_KEY = process.env.RESTLET_CONSUMER_KEY;
const ACCESS_TOKEN = process.env.TOKEN;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const ACCESS_TOKEN_SECRET = process.env.TOKEN_SECRET;
const SCRIPT_ID = '841'; // Replace with your actual script ID
const SCRIPT_DEPLOYMENT_ID = '3'; // Replace with your actual deployment ID

const callRestlet = async (searchID) => {
  // Base URL for NetSuite RESTlet
  const baseUrl = `https://${REALM}.restlets.api.netsuite.com/app/site/hosting/restlet.nl`;
  // Combine base URL with script and deployment parameters
  const baseUrlWithParameters = `${baseUrl}?script=${SCRIPT_ID}&deploy=${SCRIPT_DEPLOYMENT_ID}`;
  // OAuth configuration
  const oauthSignatureMethod = 'HMAC-SHA256';
  const oauthVersion = '1.0';
  // Generate a random nonce and timestamp for OAuth
  const oauthNonce = crypto.randomBytes(32).toString('hex'); // do not try to use oauth.getNonce()
  const oauthTimestamp = Math.floor(Date.now() / 1000); // do not try to use oauth.getTimeStamp()

  // OAuth parameters
  const oauthParameters = {
    script: SCRIPT_ID,
    oauth_consumer_key: CONSUMER_KEY,
    oauth_token: ACCESS_TOKEN,
    oauth_nonce: oauthNonce,
    oauth_timestamp: oauthTimestamp,
    oauth_signature_method: oauthSignatureMethod,
    oauth_version: oauthVersion,
    deploy: SCRIPT_DEPLOYMENT_ID
  };

  // Sort and join OAuth parameters to create a parameter string
  const sortedParameters = Object.keys(oauthParameters)
    .sort()
    .map((key) => `${key}=${oauthParameters[key]}`)
    .join('&');

  // Create the signature base string for OAuth
  const signatureBaseString = `POST&${encodeURIComponent(baseUrl)}&${encodeURIComponent(sortedParameters)}`;
  // Create the signing key for HMAC-SHA256
  const signingKey = `${CONSUMER_SECRET}&${ACCESS_TOKEN_SECRET}`;
  // Calculate the HMAC-SHA256 signature
  const hmac = crypto.createHmac('sha256', signingKey);
  hmac.update(signatureBaseString);
  let oauthSignature = hmac.digest('base64');
  // Encode the signature component for HTTP transmission
  oauthSignature = encodeURIComponent(oauthSignature);

  // HTTP headers for the API call
  const headers = {
    'Prefer': 'transient',
    'Content-Type': 'application/json',
    'Authorization': `OAuth realm="${REALM}",oauth_nonce="${oauthNonce}",oauth_signature_method="${oauthSignatureMethod}",oauth_consumer_key="${CONSUMER_KEY}",oauth_token="${ACCESS_TOKEN}",oauth_timestamp="${oauthTimestamp}",oauth_version="${oauthVersion}",oauth_signature="${oauthSignature}"`
  };

  // Payload for the API call
  const payload = {
    searchID,
  };

  // Debugging: Log values for inspection
  console.log('OAuth Parameters:', oauthParameters);
  console.log('Parameter String:', sortedParameters);
  console.log('Signature Base String:', signatureBaseString);
  console.log('Signing Key:', signingKey);
  console.log('Calculated Signature:', oauthSignature);

  try {
    // Make the API call using Axios
    const response = await axios.post(baseUrlWithParameters, payload, {
      headers,
    });

    // Return the API response data
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error making API call:', error.message);
    throw error;
  }
  
};
module.exports = {
  callRestlet,
};
