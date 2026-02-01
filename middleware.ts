import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protected routes - require auth
  if (pathname.startsWith('/editor')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // If logged in but no username, redirect to onboarding
    if (!req.auth?.user?.username) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  // Auth pages - redirect to editor if already logged in
  if (pathname === '/login' || pathname === '/register') {
    if (isLoggedIn) {
      if (!req.auth?.user?.username) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
      return NextResponse.redirect(new URL('/editor', req.url));
    }
  }

  // Onboarding - require auth but no username
  if (pathname === '/onboarding') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (req.auth?.user?.username) {
      return NextResponse.redirect(new URL('/editor', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/editor/:path*', '/login', '/register', '/onboarding'],
};
