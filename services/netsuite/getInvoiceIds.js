const axios = require('axios');
require('dotenv').config();
const restletRequest = require('./restletRequest');

let internalIds = [];
let uniqueInternalIds;

const getInternalIds = async (searchId) => {
    const jsonData = await restletRequest.callRestlet(searchId);

    for (let invoiceDocKey in jsonData) {
        const invoiceDoc = jsonData[invoiceDocKey];

        for (let invoiceInfoKey in invoiceDoc) {
            const invoiceInfo = invoiceDoc[invoiceInfoKey];

            internalIds.push(invoiceInfo.id);
        }
    }

    uniqueInternalIds = [...new Set(internalIds)];

    console.log(uniqueInternalIds);

    if (uniqueInternalIds.length === 0) {
        console.log("No new invoices. :)");
    }

    return uniqueInternalIds;
};

module.exports = {
    getInternalIds,
};
