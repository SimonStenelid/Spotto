Openrouter API key: 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

✅ Full Integration: OpenRouter + Meta LLaMA 3.1 8B Instruct

🔧 1. Install OpenAI SDK [completed]
(Still used, since OpenRouter mimics OpenAI's API)

npm install openai

🔑 2. Set Up OpenAI Client With OpenRouter
js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "YOUR_OPENROUTER_API_KEY", // from https://openrouter.ai
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://your-app-url.com", // required by OpenRouter
    "X-Title": "GenZ Travel App", // optional but helpful for analytics
  },
});
🔒 Replace "https://your-app-url.com" with your real domain. If you're in dev, just use a placeholder like http://localhost:3000 for now.

💬 3. Call the Meta LLaMA 3.1 8B Instruct Model
js
async function summarizePlace({ name, description, reviews }) {
  const prompt = `
Create a short, Gen-Z friendly travel summary:
- Place: ${name}
- Description: ${description}
- Top Reviews: ${reviews.slice(0, 3).join(" | ")}

Make it no more than 120 words, casual, punchy, and highlight the best part about visiting, and a detailed description of what you can do there/what the place is.
`;

  const response = await openai.chat.completions.create({
    model: "meta-llama/llama-3-8b-instruct", // exact model for LLaMA 3.1 8B
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

🔄 4. Use It in Your Frontend Flow
Use this function when:

Use batch summarization in a backend task to prefill summaries for all map pins

5. 
Store all place summarizes in Supabase in the "place" table. 


