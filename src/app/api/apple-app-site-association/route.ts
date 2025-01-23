import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // .well-known klasöründeki dosyayı oku
    const filePath = path.join(process.cwd(), 'public', '.well-known', 'apple-app-site-association');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonContent = JSON.parse(fileContent);

    // JSON formatında yanıt döndür
    return new NextResponse(JSON.stringify(jsonContent, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving apple-app-site-association:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 