import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Get all products
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const products = await db.collection('products').find({}).toArray();
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Create new product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    // Generate a unique product ID
    const count = await db.collection('products').countDocuments();
    const productId = `QR${String(count + 1).padStart(7, '0')}`;
    
    // Generate QR code
    const qrCodeData = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}?productId=${productId}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    
    const product = {
      ...data,
      productId,
      qrCode: qrCodeImage,
      createdAt: new Date()
    };
    
    await db.collection('products').insertOne(product);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
