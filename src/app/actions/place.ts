'use server'

import { Place } from "@/types";
import { supabase } from "@/lib/supabase";
import { generatePlaceSummary, updatePlaceSummary } from "@/lib/ai-summarizer";

// Function to create a new place with automatic summary generation
export async function createPlace(placeData: Omit<Place, 'id' | 'created_at' | 'updated_at' | 'ai_summary'>) {
  try {
    // Insert the place first
    const { data: place, error: insertError } = await supabase
      .from('places')
      .insert(placeData)
      .select()
      .single();

    if (insertError) throw insertError;

    // Generate and store the summary
    const summary = await generatePlaceSummary(place);
    if (summary) {
      await updatePlaceSummary(place.id, summary);
    }

    return { place, error: null };
  } catch (error) {
    console.error('Error creating place:', error);
    return { place: null, error };
  }
}

// Function to update an existing place's summary
export async function regeneratePlaceSummary(placeId: string) {
  try {
    // Get the place data
    const { data: place, error: fetchError } = await supabase
      .from('places')
      .select('*')
      .eq('id', placeId)
      .single();

    if (fetchError) throw fetchError;

    // Generate and store the new summary
    const summary = await generatePlaceSummary(place);
    if (summary) {
      await updatePlaceSummary(place.id, summary);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error regenerating place summary:', error);
    return { success: false, error };
  }
}

// Function to generate summaries for all places that don't have one
export async function generateMissingSummaries() {
  try {
    // Get all places without summaries
    const { data: places, error: fetchError } = await supabase
      .from('places')
      .select('*')
      .is('ai_summary', null);

    if (fetchError) throw fetchError;

    // Generate summaries for each place
    const results = await Promise.all(
      places.map(async (place) => {
        const summary = await generatePlaceSummary(place);
        if (summary) {
          await updatePlaceSummary(place.id, summary);
          return { placeId: place.id, success: true };
        }
        return { placeId: place.id, success: false };
      })
    );

    return { results, error: null };
  } catch (error) {
    console.error('Error generating missing summaries:', error);
    return { results: [], error };
  }
}

// Function to search places by query and/or type
export async function searchPlaces(query: string) {
  try {
    console.log('Starting search with query:', query);
    
    // Clean and prepare the search query
    const searchQuery = query.trim().toLowerCase();
    
    // Search in stored places across multiple fields
    const { data: places, error: searchError } = await supabase
      .from('places')
      .select('*')
      .or(
        `name.ilike.%${searchQuery}%,` +
        `description.ilike.%${searchQuery}%,` +
        `category.ilike.%${searchQuery}%`
      )
      .limit(10);

    console.log('Places search results:', places);
    console.log('Places search error:', searchError);

    if (searchError) throw searchError;

    // If no direct matches, try searching by type
    if (!places?.length) {
      const commonTypes = [
        'restaurant', 'cafe', 'bar', 'museum', 'park', 'store', 'shopping',
        'food', 'nightlife', 'cultural', 'activity'
      ];
      
      // Check if the search query partially matches any common type
      const matchingTypes = commonTypes.filter(type => 
        type.includes(searchQuery) || searchQuery.includes(type)
      );

      if (matchingTypes.length > 0) {
        // Search for places with matching categories
        const { data: typeResults, error: typeError } = await supabase
          .from('places')
          .select('*')
          .in('category', matchingTypes)
          .limit(10);

        console.log('Type search results:', typeResults);
        console.log('Type search error:', typeError);

        if (typeError) throw typeError;
        
        return { results: typeResults || [], error: null };
      }
    }

    return { results: places || [], error: null };
  } catch (error) {
    console.error('Error searching places:', error);
    return { results: [], error };
  }
} 