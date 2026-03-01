require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Checking API Key:", key ? "Found" : "Missing");
    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-flash-latest"];

    for (const modelName of models) {
        try {
            console.log(`\n--- Testing model: ${modelName} ---`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("hello");
            const response = await result.response;
            console.log(`✅ Success with ${modelName}:`, response.text().substring(0, 30));
            return;
        } catch (e) {
            console.error(`❌ Error with ${modelName}:`, e.message || e);
        }
    }
}

test();
