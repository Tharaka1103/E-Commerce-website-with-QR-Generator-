import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { QrCode, Tag, Star, ArrowLeft, ShoppingCart, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

// Product display client component
import { ProductDisplay } from '@/components/ProductDisplay';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center py-4 mb-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span>E-Commerce</span>
          </Link>
          <ThemeSwitch />
        </header>

        <Suspense fallback={
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
        }>
          <ProductDisplay />
        </Suspense>
      </div>
    </main>
  );
}
