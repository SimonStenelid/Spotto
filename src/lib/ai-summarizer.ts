'use server'

import OpenAI from "openai";
import { Place } from "../types";
import { supabase } from "./supabase";

// Initialize OpenRouter client lazily
function getOpenAIClient() {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!apiKey) throw new Error('OpenRouter API key is not set in environment variables');
  if (!appUrl) throw new Error('App URL is not set in environment variables');

  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": appUrl,
      "X-Title": "Spotto",
    },
  });
}

// Function to fetch content from a website
async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Spotto/1.0; +http://spotto.com)'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // More sophisticated HTML to text conversion
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
      .replace(/<[^>]*>/g, ' ') // Remove remaining HTML tags
      .replace(/&nbsp;/g, ' ') // Replace HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
      .trim()
      .slice(0, 3000); // Allow slightly more content for better context
    
    return text || 'No content available';
  } catch (error) {
    console.error('Error fetching website content:', error);
    return error instanceof Error ? `Failed to fetch content: ${error.message}` : 'Failed to fetch content';
  }
}

// Function to generate a summary for a place
export async function generatePlaceSummary(place: Place): Promise<string | null> {
  try {
    // Get website content if available
    const websiteContent = place.website 
      ? await fetchWebsiteContent(place.website)
      : '';

    const prompt = `You are a Gen-Z travel influencer creating engaging, authentic content for your followers. Write a short, vibey summary of this spot:

PLACE INFO:
🏠 Name: ${place.name}
📍 Type: ${place.category}
📮 Location: ${place.formatted_address}
${place.rating ? `⭐ Rating: ${place.rating}/5` : ''}
${place.description ? `📝 Official Description: ${place.description}` : ''}
${websiteContent ? `🌐 Website Details: ${websiteContent}` : ''}

WRITING GUIDELINES:
- Keep it under 120 words and super engaging
- Use casual, modern language that feels authentic
- Include emojis naturally (2-3 max)
- Focus on:
  1. The main vibe/aesthetic of the place
  2. What makes it unique or Instagram-worthy
  3. What you can actually do there
  4. Why your followers would love it

Make it sound like a genuine recommendation from a friend, not a formal review. Avoid clichés and overly promotional language.`;

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8, // Slightly higher for more creative responses
      max_tokens: 200, // Ensure we get a complete response
    });

    return response.choices[0].message.content?.trim() || null;
  } catch (error) {
    console.error('Error generating place summary:', error);
    return null;
  }
}

// Function to update place summary in Supabase
export async function updatePlaceSummary(placeId: string, summary: string) {
  const { error } = await supabase
    .from('places')
    .update({ ai_summary: summary })
    .eq('id', placeId);

  if (error) {
    console.error('Error updating place summary:', error);
    throw error;
  }
} 