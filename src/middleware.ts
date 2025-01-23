import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Apple app site association dosyası için özel işlem
  if (request.nextUrl.pathname === '/.well-known/apple-app-site-association') {
    try {
      const response = await fetch(new URL('/.well-known/apple-app-site-association', request.url));
      const data = await response.json();

      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600'
        },
      });
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
} 