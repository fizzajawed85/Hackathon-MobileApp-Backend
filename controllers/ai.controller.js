const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithGemini = async (req, res) => {
    try {
        const { message } = req.body;
        console.log("📩 AI Request:", message);

        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ MISSING GEMINI_API_KEY");
            return res.status(500).json({ success: false, message: "API Key missing" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are MedBot, an empathetic healthcare assistant for MedicalApp. " +
                "Provide medical guidance and suggest specialists for symptoms. " +
                "Always end with: 'Disclaimer: I am an AI assistant. Please consult a professional doctor for a formal diagnosis.' " +
                "Keep responses concise and formatted."
        });

        console.log("🤖 Requesting Gemini (2.5-flash)...");
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        console.log("✅ AI Response Success");

        res.status(200).json({
            success: true,
            reply: text
        });
    } catch (error) {
        console.error("❌ GEMINI AI ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: "AI assistant is currently unavailable.",
            errorDetails: error.message
        });
    }
};

module.exports = { chatWithGemini };
