import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'localhost:3000';
  
  // Get tenant from the URL path (e.g., `domain.com/derma` -> `derma`)
  const pathParts = url.pathname.split('/');
  const pathTenantSlug = pathParts[1];

  // For local development, also check the subdomain
  const isLocalhost = hostname.includes('localhost');
  const subdomainTenantSlug = isLocalhost ? hostname.split('.')[0] : null;

  // Use the path-based tenant slug if it exists, otherwise use the subdomain for local dev
  const currentTenantSlug = pathTenantSlug || subdomainTenantSlug;

  // Prevent direct access to the internal /tenant/ route
  if (pathParts[1] === 'tenant') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If a tenant slug is found, rewrite the URL to the internal route
  if (currentTenantSlug && currentTenantSlug !== 'www' && currentTenantSlug !== 'localhost' && pathParts[1] !== 'tenant') {
     console.log(`Rewriting to /tenant/${currentTenantSlug}/${pathParts.slice(2).join('/')}`);
     
     // Construct the new path for the internal route
     const newPath = `/tenant/${currentTenantSlug}/${pathParts.slice(2).join('/')}`;
     
     return NextResponse.rewrite(
       new URL(newPath, req.url)
     );
  }

  return NextResponse.next();
}
