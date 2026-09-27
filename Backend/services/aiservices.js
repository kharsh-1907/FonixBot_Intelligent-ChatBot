const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateAIResponse = async (history) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: history
        });

        return response.text;
    }
    catch (error) {
        console.error("Gemini Error:", error.message);
        return res.status(502).json({ error: "AI service is Not available"});
    }

};

module.exports = {
    generateAIResponse
};