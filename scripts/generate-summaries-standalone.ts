#!/usr/bin/env node

// Set environment variables
const ENV = {
  OPENROUTER_API_KEY: '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',
  APP_URL: 'http://localhost:5173/',
  SUPABASE_URL: 'https://jjkdamyrulnpcwcfvegn.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa2RhbXlydWxucGN3Y2Z2ZWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODQ5ODcsImV4cCI6MjA2MTc2MDk4N30.kZiXjkZ9GNqiUjbVNZImO2mR5aq-VIER0hJ31amVmdA'
};

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import pLimit from 'p-limit';

// Types
interface Place {
  id: string;
  name: string;
  category: string;
  formatted_address: string;
  website?: string;
  description?: string;
  rating?: number;
  ai_summary?: string;
  last_summary_generated?: string;
}

// Initialize clients
const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

const openai = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": ENV.APP_URL,
    "X-Title": "Spotto",
  },
});

// Rate limiting - 3 concurrent requests, 1 second delay between each
const limit = pLimit(3);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch content from a website
async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
    
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E]/g, '')
      .trim()
      .slice(0, 3000);
    
    return text || 'No content available';
  } catch (error) {
    console.error('Error fetching website content:', error);
    return error instanceof Error ? `Failed to fetch content: ${error.message}` : 'Failed to fetch content';
  }
}

// Function to generate a summary for a place
async function generatePlaceSummary(place: Place): Promise<string | null> {
  try {
    const websiteContent = place.website 
      ? await fetchWebsiteContent(place.website)
      : '';

    const prompt = `You are a professional travel content writer. Write a detailed and informative summary of this place based on the provided information:

PLACE DETAILS:
Name: ${place.name}
Category: ${place.category}
Location: ${place.formatted_address}
${place.rating ? `Rating: ${place.rating}/5` : ''}
${place.description ? `Description: ${place.description}` : ''}
${websiteContent ? `Website Content: ${websiteContent}` : ''}

Please include (based on available information):
1. What the place is and its significance in the local area
2. Key features, attractions, or specialties
3. Target audience and who would most enjoy visiting
4. Notable atmosphere, ambiance, or cultural elements
5. What visitors can expect from their experience

Keep it factual, informative, and engaging. Focus on the information that's most relevant to the type of establishment (${place.category}).
If information is limited, focus on what is known and avoid making assumptions.`;

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 200,
    });

    if (!response.choices?.[0]?.message?.content) {
      console.error('Invalid API response:', JSON.stringify(response, null, 2));
      throw new Error('Invalid API response structure');
    }

    const summary = response.choices[0].message.content.trim();
    if (!summary) {
      throw new Error('Empty summary received');
    }

    return summary;
  } catch (error) {
    console.error('Error generating place summary:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if ('response' in error) {
        console.error('API Response:', JSON.stringify(error.response, null, 2));
      }
    }
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
    
    await delay(1000);
  } catch (error) {
    stats.failed++;
    console.error(`✗ Failed to process ${place.name}:`, error);
    
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

    await Promise.all(
      places.map(place => 
        limit(() => processPlace(place, stats))
      )
    );

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

process.on('SIGINT', () => {
  console.log('\nProcess interrupted. Cleaning up...');
  process.exit(0);
});

main(); 