import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

// Get credentials from command line arguments
const supabaseUrl = process.argv[2];
const supabaseKey = process.argv[3];
const openaiKey = process.argv[4];

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error('Usage: npx tsx generate-place-summaries.ts <supabase-url> <supabase-key> <openai-key>');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  neighborhood: string;
  formatted_address?: string;
  website?: string;
  types?: string[];
  ai_summary?: string;
}

async function generateSummary(place: Place): Promise<string> {
  const prompt = `Write a concise, engaging summary of this place in Stockholm:

Name: ${place.name}
Category: ${place.category}
Neighborhood: ${place.neighborhood}
Description (in Swedish): ${place.description}
Type: ${place.types?.join(', ')}
Address: ${place.formatted_address}

Please write a summary that:
1. Is clear and minimal in language
2. Highlights what visitors can do or experience
3. Mentions any historical or cultural significance
4. Is around 2-3 sentences
5. Is in English
6. Avoids marketing language or excessive adjectives
7. Focuses on factual information`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a knowledgeable local guide providing clear, factual information about places in Stockholm. Write in a concise, straightforward style."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 150
  });

  return completion.choices[0].message.content?.trim() || '';
}

async function updatePlaceSummaries() {
  try {
    // Fetch all places without AI summaries
    const { data: places, error: fetchError } = await supabase
      .from('places')
      .select('*')
      .is('ai_summary', null);

    if (fetchError) {
      throw new Error(`Error fetching places: ${fetchError.message}`);
    }

    if (!places || places.length === 0) {
      console.log('No places found that need AI summaries.');
      return;
    }

    console.log(`Found ${places.length} places that need AI summaries.`);

    // Generate and update summaries
    for (const place of places) {
      try {
        console.log(`Generating summary for ${place.name}...`);
        const summary = await generateSummary(place);

        const { error: updateError } = await supabase
          .from('places')
          .update({ 
            ai_summary: summary,
            last_summary_generated: new Date().toISOString()
          })
          .eq('id', place.id);

        if (updateError) {
          console.error(`Error updating ${place.name}:`, updateError);
        } else {
          console.log(`Successfully updated ${place.name} with AI summary`);
          console.log('Summary:', summary);
          console.log('---');
        }

        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing ${place.name}:`, error);
      }
    }

    console.log('Finished generating summaries');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the summary generation
updatePlaceSummaries().catch(console.error); 