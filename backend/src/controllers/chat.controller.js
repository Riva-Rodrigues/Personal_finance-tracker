import { GoogleGenerativeAI } from "@google/generative-ai"; // Using import instead of require

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function sendMessage(req, res) {
  const { message } = req.body;

  if (!message || message.toLowerCase() === "exit") {
    return res.status(400).json({ error: "Invalid message" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = await response.text();
    const cleanResponse = text.replace(/[^a-zA-Z0-9\s.,]/g, '').replace(/\s+/g, ' ').trim();


    const formattedResponse = cleanResponse
    .replace(/(\d+)\. /g, '\n$&') // Add a line break before numbered lists
    .replace(/(\s)([A-Z])/g, '$1\n$2'); // Start a new line for capitalized sentences

    return res.status(200).json({ response: formattedResponse });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
