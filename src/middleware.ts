import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'localhost:3000';

  const isLocalhost = hostname.includes('localhost');
  let currentTenantSlug: string | null = null;
  
  if (isLocalhost) {
    currentTenantSlug = hostname.split('.')[0];
  } else {
    currentTenantSlug = hostname.split('.')[0];
  }

  const path = url.pathname.split('/')[1];
  if (path === 'tenant') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  if (currentTenantSlug && currentTenantSlug !== 'www' && currentTenantSlug !== 'localhost') {
     console.log(`Rewriting to /tenant/${currentTenantSlug}${url.pathname}`);
     return NextResponse.rewrite(
       new URL(`/tenant/${currentTenantSlug}${url.pathname}`, req.url)
     );
  }

  return NextResponse.next();
}