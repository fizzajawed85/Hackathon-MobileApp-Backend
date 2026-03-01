const axios = require('axios');
require('dotenv').config();

async function test() {
    const key = process.env.GEMINI_API_KEY;
    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    console.log(`Testing URL: https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=...`);

    try {
        const res = await axios.post(url, {
            contents: [{ parts: [{ text: "Hello" }] }]
        });
        console.log("✅ Success!");
        console.log("Response:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error("❌ API ERROR");
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Status Text:", e.response.statusText);
            console.error("Error Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("Message:", e.message);
        }
    }
}

test();
