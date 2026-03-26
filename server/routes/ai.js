import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize AI early
let genAI;
try {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (key) {
    genAI = new GoogleGenerativeAI(key);
    console.log('✅ Gemini AI System: Key loaded and initialized.');
  } else {
    console.error('❌ Gemini AI System: No API key found in .env!');
  }
} catch (e) {
  console.error('❌ Gemini AI System: Initialization error:', e.message);
}

// Analyze health metrics
router.post('/analyze', async (req, res) => {
  try {
    const { metrics, user } = req.body;
    
    if (!genAI) throw new Error('AI system not initialized. Check your API key.');

    // Attempt with 1.5-flash, fallback to pro if needed
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      As a professional healthcare AI assistant for senior citizens, analyze the following health data for ${user?.name || 'the patient'}:
      Metrics: ${JSON.stringify(metrics)}
      
      Provide:
      1. A brief summary of current health status.
      2. 3 actionable health tips based on these metrics.
      3. A "Health Score" from 1-10.
      Keep it encouraging and easy to understand for an elderly person.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });
  } catch (error) {
    console.error('--- Gemini Analysis Error ---');
    console.error('Message:', error.message);
    console.error('-----------------------------');
    res.status(500).json({ message: 'AI Analysis failed', error: error.message });
  }
});

// Smart Medication Assistant
router.post('/medication-assistant', async (req, res) => {
  try {
    const { medications, query } = req.body;
    
    if (!genAI) throw new Error('AI system not initialized. Check your API key.');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      User Query: ${query}
      Current Medications: ${JSON.stringify(medications)}
      
      Respond as a helpful and safe medication assistant for elderly people. 
      If the user asks about interactions, explain simply. 
      Always include a disclaimer to consult their doctor.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error('--- Gemini Assistant Error ---');
    console.error('Message:', error.message);
    console.error('-----------------------------');
    res.status(500).json({ message: 'Assistant failed', error: error.message });
  }
});

export default router;
