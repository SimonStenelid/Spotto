import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import Map from './Map';
import { MapPromotion } from '../promotion/MapPromotion';

interface RestrictedMapProps {
  className?: string;
}

export function RestrictedMap({ className }: RestrictedMapProps) {
  const { user } = useAuthStore();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('user_access')
          .select('has_map_access')
          .eq('user_id', user.id)
          .single();

        setHasAccess(data?.has_map_access || false);
      } catch (error) {
        console.error('Error checking map access:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
        <MapPromotion variant="compact" />
      </div>
    );
  }

  return <Map className={className} />;
} 