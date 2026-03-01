const https = require('https');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models?key=${key}`,
    method: 'GET'
};

console.log("Listing available models for the key...");
const req = https.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    let responseData = '';
    res.on('data', (d) => responseData += d);
    res.on('end', () => {
        console.log('Response Body:', responseData);
    });
});

req.on('error', (e) => console.error(e));
req.end();
