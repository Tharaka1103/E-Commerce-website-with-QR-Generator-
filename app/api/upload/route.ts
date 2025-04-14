import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create a unique filename
    const fileName = `${uuidv4()}_${file.name.replace(/\s+/g, '-')}`;
    
    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
    });
    
    // Return the URL of the uploaded file
    return NextResponse.json({ fileUrl: blob.url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
