"use client"

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ProductEditFormProps {
  product: Product;
  onProductUpdated: () => void;
}

const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty",
  "Books",
  "Toys",
  "Sports",
  "Automotive"
];

export function ProductEditForm({ product, onProductUpdated }: ProductEditFormProps) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [category, setCategory] = useState(product.category);
  const [features, setFeatures] = useState<string[]>(product.features);
  const [newFeature, setNewFeature] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageChanged, setImageChanged] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageChanged(true);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let productData: any = {
        title,
        description,
        price: parseFloat(price),
        category,
        features,
      };

      // Only upload a new image if one was selected
      if (imageChanged && imageFile) {
        // Upload new image first
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { fileUrl } = await uploadResponse.json();
        productData.imageUrl = fileUrl;
      }

      // Update product
      const productResponse = await fetch(`/api/products/${product.productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!productResponse.ok) {
        throw new Error('Failed to update product');
      }

      onProductUpdated();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-destructive/15 text-destructive">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="edit-title">Product Title</Label>
        <Input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-price">Price</Label>
          <Input
            id="edit-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="edit-category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="edit-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>Product Features</Label>
        <div className="flex space-x-2">
          <Input
            placeholder="Add a feature"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addFeature();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={addFeature} 
            variant="secondary"
            disabled={!newFeature.trim()}
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-secondary-foreground/70 hover:text-secondary-foreground focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="edit-image">Product Image</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-md p-4 text-center hover:border-primary/50 transition-colors",
              imagePreview ? "border-primary" : "border-border"
            )}
          >
            <input
              type="file"
              id="edit-image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Label htmlFor="edit-image" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {imageFile ? imageFile.name : "Click to change product image"}
              </span>
            </Label>
          </div>
          
          {imagePreview && (
            <div className="relative aspect-square rounded-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Product preview"
                className="object-cover w-full h-full"
              />
              {imageChanged && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(product.imageUrl);
                    setImageChanged(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
