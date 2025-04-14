import { unlink } from 'fs/promises';
import path from 'path';

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
