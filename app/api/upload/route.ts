import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const fileName = `${uuidv4()}_${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    
    // Write the file to the server
    await writeFile(filePath, buffer);
    
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}

// Helper function to delete a file
export async function deleteFile(fileUrl: string) {
  try {
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
      throw new Error('Invalid file URL');
    }

    const fileName = fileUrl.replace('/uploads/', '');
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);
    
    await unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
