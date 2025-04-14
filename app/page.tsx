"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, ArrowLeft, QrCode, Tag, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface Product {
  _id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  features: string[];
  qrCode: string;
  createdAt: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Sample additional images for showcase
  const productImages = product ? [product.imageUrl, ...Array(3).fill(product.imageUrl)] : [];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center py-4 mb-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span>E-Commerce</span>
          </Link>
          <ThemeSwitch />
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-6">
                  <div className="md:flex gap-8">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                      <Skeleton className="aspect-square w-full rounded-lg" />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-10 w-3/4" />
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-24 w-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-2/3" />
                      </div>
                      <Skeleton className="h-10 w-full mt-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="max-w-md mx-auto text-center p-8">
                <CardContent className="flex flex-col items-center">
                  <div className="bg-destructive/15 text-destructive rounded-full p-4 mb-4">
                    <QrCode className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
                  <p className="text-muted-foreground mb-6">
                    The scanned QR code doesn't match any product in our system.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : product ? (
            <motion.div
              key="product"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="shadow-md overflow-hidden border">
                <CardContent className="p-0">
                  <div className="md:grid md:grid-cols-2 gap-0">
                    <div className="bg-card">
                      <div className="sticky top-0">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={activeImage}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              src={productImages[activeImage]}
                              alt={product.title}
                              className="object-cover w-full h-full"
                            />
                          </AnimatePresence>
                          
                          {productImages.length > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full"
                                onClick={() => setActiveImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full"
                                onClick={() => setActiveImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                        
                        {productImages.length > 1 && (
                          <div className="flex justify-center mt-4 gap-2 px-4 pb-4">
                            {productImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`h-2 rounded-full transition-all ${
                                  activeImage === index ? 'w-8 bg-primary' : 'w-2 bg-muted'
                                }`}
                                aria-label={`View image ${index + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6 bg-card/50">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary" className="text-sm">
                            {product.category}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <time dateTime={new Date(product.createdAt).toISOString()}>
                              {new Date(product.createdAt).toLocaleDateString()}
                            </time>
                          </div>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill={star <= 4 ? 'currentColor' : 'none'} 
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">(24 reviews)</span>
                        </div>
                        <p className="text-primary text-2xl font-bold">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="details">Details</TabsTrigger>
                          <TabsTrigger value="features">Features</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="pt-4">
                          <div className="prose prose-sm max-w-none text-card-foreground">
                            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="features" className="pt-4">
                          <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-card-foreground">
                                <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0"></span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                          <Tag className="h-3.5 w-3.5" />
                          <span>Product ID: {product.productId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-muted/50 p-6 flex justify-center">
                  
                </CardFooter>
              </Card>
              
              <Card className="mt-8 shadow-sm">
                <CardHeader>
                  <CardTitle>QR Code</CardTitle>
                  <CardDescription>
                    Scan this QR code to easily share this product with others
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="bg-white p-6 rounded-lg shadow-sm border max-w-[200px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.qrCode}
                      alt="Product QR Code"
                      className="w-full h-auto"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto text-center py-16"
            >
              <div className="mb-8">
                <QrCode className="h-16 w-16 mx-auto mb-4 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Welcome to our E-Commerce Store</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Scan a product QR code to view product details. 
                Our products feature unique QR codes that provide instant access to detailed product information.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                      <QrCode className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Scan QR Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your mobile device to scan product QR codes
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                      <Tag className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">View Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Access detailed information about products instantly
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                      <ShoppingCart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Demo Only</h3>
                    <p className="text-sm text-muted-foreground">
                      This is a demonstration of QR code product viewing
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
