import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlaceDetailsSheet } from '../components/place/PlaceDetailsSheet';
import { useEffect, useState } from 'react';
import type { Place } from '../types';
import { supabase } from '../lib/supabase';

const PlaceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlace() {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPlace(data);
      } catch (error) {
        console.error('Error fetching place:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlace();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Place not found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <PlaceDetailsSheet
      place={place}
      isOpen={true}
      onClose={() => navigate('/')}
    />
  );
};

export default PlaceDetailPage;