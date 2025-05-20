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
  if (!session && request.nextUrl.pathname.startsWith('/bookmarks')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Enhanced caching strategy
  const isStaticAsset = request.nextUrl.pathname.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff2?)$/);
  const isNextAsset = request.nextUrl.pathname.startsWith('/_next/');
  const isStaticPage = !request.nextUrl.pathname.includes('/api/') && !request.nextUrl.pathname.includes('/auth/');

  if (isStaticAsset || isNextAsset) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (isStaticPage) {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }

  // Add Server-Timing header for performance monitoring
  response.headers.set('Server-Timing', 'miss, db;dur=53, app;dur=47.2');
  
  // Enable HTTP/2 Server Push for critical assets
  if (isStaticPage) {
    response.headers.set('Link', '</styles.css>; rel=preload; as=style, </main.js>; rel=preload; as=script');
  }

  return response;
}

export const config = {
  matcher: ['/bookmarks/:path*'],
}; 