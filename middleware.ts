import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // If user is not authenticated, redirect to login
  if (!session && request.nextUrl.pathname.startsWith('/map')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated, check if they have map access
  if (session && request.nextUrl.pathname.startsWith('/map')) {
    const { data: access } = await supabase
      .from('user_access')
      .select('has_map_access')
      .eq('user_id', session.user.id)
      .single();

    if (!access?.has_map_access) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/map/:path*'],
}; 