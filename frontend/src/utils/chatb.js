import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA5ufnzaHQOawh89PKRKssaOq5OLQBF85I';
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Function to generate a response using Google Gemini AI based on user input and financial data
 * @param {string} userText - The user's input/question
 * @param {array} transactions - The user's transaction data
 * @param {array} accounts - The user's account data
 * @param {array} bills - The user's bills data
 * @returns {string} The generated AI response
 */
export const generateDescription = async (userText, transactions, accounts, bills) => {
  try {
    const prompt = `
      Answer the following user query in 2-3 lines. The amount should be displayed in Rs:
      User's Question: "${userText}"

      Based on the user's transactions:
      ${JSON.stringify(transactions)}

      And the user's accounts:
      ${JSON.stringify(accounts)}

      And the user's bills:
      ${JSON.stringify(bills)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Sorry, there was an error generating the response.';
  }
};
