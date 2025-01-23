import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fileName = url.pathname.split('/').pop();

  if (!fileName) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    let filePath;
    if (fileName === 'apple-app-site-association') {
      filePath = path.join(process.cwd(), 'public', '.well-known', fileName);
    } else if (fileName === 'assetlinks.json') {
      filePath = path.join(process.cwd(), 'public', '.well-known', fileName);
    } else {
      return new NextResponse('Not Found', { status: 404 });
    }

    const fileContent = await fs.readFile(filePath, 'utf8');
    const jsonContent = JSON.parse(fileContent);

    return new NextResponse(JSON.stringify(jsonContent, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      },
    });
  } catch (error) {
    console.error('Error serving well-known file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 