import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useToast } from '../components/ui/use-toast';
import { supabase } from '../lib/supabase';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('User not found');
        }

        // Check if access has been granted
        const { data: accessData, error: accessError } = await supabase
          .from('user_access')
          .select('has_map_access')
          .eq('user_id', user.id)
          .single();

        if (accessError) {
          throw accessError;
        }

        if (accessData?.has_map_access) {
          toast({
            title: 'Payment Successful!',
            description: 'You now have full access to the map. Enjoy exploring!',
          });
        }

        // Redirect to map after 3 seconds
        setTimeout(() => {
          navigate('/map');
        }, 3000);
      } catch (error) {
        console.error('Error checking payment status:', error);
        toast({
          title: 'Error',
          description: 'There was an issue verifying your payment. Please contact support.',
          variant: 'destructive',
        });
      }
    };

    checkPaymentStatus();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You for Your Purchase!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We're processing your payment and setting up your access...
        </p>
        <div className="animate-pulse text-sm text-gray-500">
          You'll be redirected to the map in a few seconds
        </div>
      </div>
    </div>
  );
} 