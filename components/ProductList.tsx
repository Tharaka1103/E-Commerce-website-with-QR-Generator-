"use client"

import { motion } from 'framer-motion';
import { Eye, Download, Tag, Box, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

interface ProductListProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  isLoading?: boolean;
  onProductDeleted?: () => void;
}

export function ProductList({ products, onViewDetails, isLoading = false, onProductDeleted }: ProductListProps) {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${productToDelete.productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
      
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      
      if (onProductDeleted) {
        onProductDeleted();
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden h-full flex flex-col">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="flex flex-col flex-grow p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full mt-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <Box className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
        <p className="text-lg font-medium text-muted-foreground">No products found</p>
        <p className="text-sm text-muted-foreground/70">Create your first product to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="h-full"
          >
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative aspect-video overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute top-2 right-2 font-medium" 
                  variant="secondary">
                  {product.category}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={(e) => handleDeleteClick(product, e as any)}>
                      <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                      <span className="text-destructive">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardContent className="flex flex-col flex-grow p-5">
                <div className="flex-grow space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                  <p className="text-primary font-bold">{formatCurrency(product.price)}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs font-normal">
                        {feature}
                      </Badge>
                    ))}
                    {product.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.features.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {product.productId}
                  </p>
                </div>
                
                <Button 
                  variant="default" 
                  className="w-full mt-4 group-hover:bg-primary/90"
                  onClick={() => onViewDetails(product)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.title}"? This action cannot be undone.
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
    </>
  );
}
