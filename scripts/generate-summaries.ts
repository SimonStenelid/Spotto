#!/usr/bin/env node

// Set environment variables first, before any imports
process.env.NEXT_PUBLIC_OPENROUTER_API_KEY = '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';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:5173/';
process.env.VITE_SUPABASE_URL = 'https://jjkdamyrulnpcwcfvegn.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa2RhbXlydWxucGN3Y2Z2ZWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NTk3ODcsImV4cCI6MjAyNTAzNTc4N30.ZNdvNUZoI7Eo_4_QS_7wqq-kQyPp6OZHH_9KyUMG0Hs';

// Verify environment variables are set
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Error: Required environment variables are not set');
  process.exit(1);
}

import { Place } from '../src/types';
import { supabase } from './supabase-client';
import OpenAI from 'openai';
import pLimit from 'p-limit';

// Initialize OpenRouter client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
    "X-Title": "Spotto",
  },
});

// Rate limiting - 3 concurrent requests, 1 second delay between each
const limit = pLimit(3);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch content from a website
async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic HTML to text conversion
    const text = html
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 2000); // Limit content length
    
    return text;
  } catch (error) {
    console.error('Error fetching website content:', error);
    return '';
  }
}

// Function to generate a summary for a place
async function generatePlaceSummary(place: Place): Promise<string | null> {
  try {
    // Get website content if available
    const websiteContent = place.website 
      ? await fetchWebsiteContent(place.website)
      : '';

    const prompt = `
Create a short, Gen-Z friendly travel summary:
- Place: ${place.name}
- Category: ${place.category}
- Address: ${place.formatted_address}
- Website Content: ${websiteContent}
${place.description ? `- Description: ${place.description}` : ''}
${place.rating ? `- Rating: ${place.rating}/5` : ''}

Make it no more than 120 words, casual, punchy, and highlight:
1. The best part about visiting
2. What you can do there/what the place is
3. The vibe and atmosphere
4. Any unique or standout features

Keep it authentic and engaging for a young audience!
`;

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating place summary:', error);
    return null;
  }
}

interface ProcessingStats {
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
}

async function processPlace(place: Place, stats: ProcessingStats): Promise<void> {
  try {
    console.log(`[${stats.processed + 1}/${stats.total}] Processing ${place.name}...`);
    
    const summary = await generatePlaceSummary(place);
    if (!summary) {
      throw new Error('Failed to generate summary');
    }

    const { error } = await supabase
      .from('places')
      .update({ 
        ai_summary: summary,
        last_summary_generated: new Date().toISOString()
      })
      .eq('id', place.id);

    if (error) throw error;

    stats.succeeded++;
    console.log(`✓ Summary generated for ${place.name}`);
    
    // Add a small delay between successful processes
    await delay(1000);
  } catch (error) {
    stats.failed++;
    console.error(`✗ Failed to process ${place.name}:`, error);
    
    // Log error to database for tracking
    const { error: logError } = await supabase
      .from('summary_generation_errors')
      .insert({
        place_id: place.id,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        attempted_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Failed to log error:', logError);
    }
  } finally {
    stats.processed++;
  }
}

async function main() {
  console.log('Starting to generate summaries using Meta LLaMA...\n');
  
  try {
    // Get all places without summaries or with old summaries
    const { data: places, error: fetchError } = await supabase
      .from('places')
      .select('*')
      .or('ai_summary.is.null,last_summary_generated.lt.now()-interval\'30 days\'');

    if (fetchError) throw fetchError;

    if (!places || places.length === 0) {
      console.log('No places found that need summaries.');
      return;
    }

    const stats: ProcessingStats = {
      total: places.length,
      processed: 0,
      succeeded: 0,
      failed: 0
    };

    console.log(`Found ${places.length} places that need summaries.\n`);

    // Process places concurrently with rate limiting
    await Promise.all(
      places.map(place => 
        limit(() => processPlace(place, stats))
      )
    );

    // Print final statistics
    console.log('\nSummary Generation Complete:');
    console.log('---------------------------');
    console.log(`Total Places: ${stats.total}`);
    console.log(`Successfully Processed: ${stats.succeeded}`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Success Rate: ${((stats.succeeded / stats.total) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('\nFatal error during summary generation:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nProcess interrupted. Cleaning up...');
  process.exit(0);
});

main(); 