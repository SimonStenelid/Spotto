'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createPaymentLink(priceId: string): Promise<string> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/create-payment-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: session.user.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment link');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Payment link creation error:', error);
    throw error;
  }
} 