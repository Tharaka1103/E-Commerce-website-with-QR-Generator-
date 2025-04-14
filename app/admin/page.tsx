"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, BarChart, Search, Filter, RefreshCw, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductForm } from '@/components/ProductForm';
import { ProductList } from '@/components/ProductList';
import { ProductDetails } from '@/components/ProductDetails';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { Input } from '@/components/ui/input';
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
    // Add any other required properties
  }

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
    setIsAddProductOpen(false);
    toast({
      title: "Product created",
      description: "The product has been successfully created.",
    });
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleProductUpdated = () => {
    fetchProducts();
    setIsDetailsOpen(false);
  };

  const handleProductDeleted = () => {
    fetchProducts();
    // If the deleted product is currently being viewed in the details dialog, close it
    if (isDetailsOpen) {
      setIsDetailsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold"
            >
              Admin Dashboard
            </motion.h1>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={fetchProducts}
                title="Refresh products"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <ThemeSwitch />
            </div>
          </div>
          
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-6 grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 shrink-0">
                      <Plus className="h-4 w-4" />
                      Add New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <CardDescription>Fill out the form to add a new product to your store.</CardDescription>
                    </DialogHeader>
                    <ProductForm onProductAdded={handleProductAdded} />
                  </DialogContent>
                </Dialog>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap justify-between items-center">
                      <div>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>
                          Manage your product inventory
                        </CardDescription>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Filter className="h-4 w-4 mr-1" />
                        {filteredProducts.length} of {products.length} products
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ProductList 
                      products={filteredProducts} 
                      onViewDetails={handleViewDetails}
                      isLoading={isLoading}
                      onProductDeleted={handleProductDeleted}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    View statistics and performance metrics for your products
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">--</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatCurrency(products.reduce((sum, product) => sum + (product?.price || 0), 0))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <p className="text-muted-foreground">Analytics visualization coming soon</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>Product Details</DialogTitle>
              </DialogHeader>
              {selectedProduct && (
                <ProductDetails 
                  product={selectedProduct} 
                  onClose={() => setIsDetailsOpen(false)}
                  onProductUpdated={handleProductUpdated}
                />
              )}
            </DialogContent>
          </Dialog>
        </header>
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
