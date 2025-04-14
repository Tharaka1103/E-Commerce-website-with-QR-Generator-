import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    const client = await clientPromise;
    const db = client.db();
    
    const product = await db.collection('products').findOne({ productId: id });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    const data = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    
    // Find the current product to get the old image URL
    const currentProduct = await db.collection('products').findOne({ productId: id });
    
    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Update product in database
    const updatedProduct = await db.collection('products').findOneAndUpdate(
      { productId: id },
      { $set: data },
      { returnDocument: 'after' }
    );
    
    // If the image has been changed, delete the old image
    if (data.imageUrl && data.imageUrl !== currentProduct.imageUrl) {
      try {
        // Extract filename from the old URL
        const oldImagePath = currentProduct.imageUrl.replace(/^\/uploads\//, '');
        if (oldImagePath) {
          const fullPath = path.join(process.cwd(), 'public/uploads', oldImagePath);
          await fs.unlink(fullPath);
          console.log(`Deleted old image: ${fullPath}`);
        }
      } catch (error) {
        console.error('Error deleting old image file:', error);
      }
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    
    const client = await clientPromise;
    const db = client.db();
    
    // Find the product to get the image URL before deletion
    const product = await db.collection('products').findOne({ productId: id });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Delete product from database
    await db.collection('products').deleteOne({ productId: id });
    
    // Delete the image file
    if (product.imageUrl) {
      try {
        // Extract filename from URL
        const imagePath = product.imageUrl.replace(/^\/uploads\//, '');
        if (imagePath) {
          const fullPath = path.join(process.cwd(), 'public/uploads', imagePath);
          await fs.unlink(fullPath);
          console.log(`Deleted image: ${fullPath}`);
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }
    
    return NextResponse.json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
