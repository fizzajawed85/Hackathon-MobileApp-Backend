const https = require('https');
require('dotenv').config();

const data = JSON.stringify({
    contents: [{ parts: [{ text: 'Hello' }] }]
});

const key = process.env.GEMINI_API_KEY;
const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log("Starting HTTPS request to Gemini...");
const req = https.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));

    let responseData = '';
    res.on('data', (d) => {
        responseData += d;
    });

    res.on('end', () => {
        console.log('Response Body:', responseData);
    });
});

req.on('error', (e) => {
    console.error("HTTPS Error:", e);
});

req.write(data);
req.end();
