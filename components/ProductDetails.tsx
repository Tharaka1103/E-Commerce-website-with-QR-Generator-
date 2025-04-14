"use client"

import { useState } from 'react';
import { Download, Printer, Share, Star, ArrowLeft, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ProductEditForm } from '@/components/ProductEditForm';

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

interface ProductDetailsProps {
  product: Product;
  onClose?: () => void;
  onProductUpdated?: () => void;
}

export function ProductDetails({ product, onClose, onProductUpdated }: ProductDetailsProps) {
  const [rating, setRating] = useState<number>(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = product.qrCode;
    link.download = `${product.productId}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${product.title}</title>
          <style>
            body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; text-align: center; }
            .container { max-width: 500px; margin: 0 auto; }
            img { max-width: 100%; }
            h1 { font-size: 18px; margin-bottom: 12px; font-weight: bold; }
            p { font-size: 14px; color: #555; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${product.title}</h1>
            <p>Product ID: ${product.productId}</p>
            <img src="${product.qrCode}" alt="QR Code" />
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleProductUpdated = () => {
    setIsEditDialogOpen(false);
    if (onProductUpdated) {
      onProductUpdated();
    }
    toast({
      title: "Product updated",
      description: "The product has been successfully updated.",
    });
  };

  const deleteProduct = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${product.productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
      
      setIsDeleteDialogOpen(false);
      if (onProductUpdated) {
        onProductUpdated();
      }
      if (onClose) {
        onClose();
      }
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ScrollArea className="max-h-[80vh]">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="bg-card p-5 rounded-xl shadow-sm border">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground">{product.title}</h2>
                  <Badge variant="secondary" className="text-sm px-3 py-1">{product.category}</Badge>
                </div>
                <p className="text-primary text-xl font-bold mt-3">
                  {formatCurrency(product.price)}
                </p>
              </div>
              
              <div className="bg-card p-5 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
              
              <div className="bg-card p-5 rounded-xl shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-card p-5 rounded-xl shadow-sm border">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-base font-medium text-card-foreground">Rate this product:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 hover:scale-110 transition-transform ${
                          rating >= star ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Product ID: {product.productId}
                </p>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="qr">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 flex flex-col items-center"
            >
              <div className="rounded-xl overflow-hidden border p-6 max-w-[300px] mx-auto bg-card shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.qrCode}
                  alt="QR Code"
                  className="w-full h-auto hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-card-foreground">Product ID: {product.productId}</p>
                <p className="text-sm text-muted-foreground">
                  Scan this QR code to view product details
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  onClick={downloadQRCode} 
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button 
                  onClick={printQRCode} 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.title,
                        text: `Check out this product: ${product.title}`,
                        url: `${window.location.origin}?productId=${product.productId}`
                      })
                    }
                  }}
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information below.
            </DialogDescription>
          </DialogHeader>
          <ProductEditForm 
            product={product} 
            onProductUpdated={handleProductUpdated} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="sm:mt-0"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteProduct}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}
