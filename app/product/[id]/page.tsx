'use client';

import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getProductById } from '@/lib/data';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart, CheckCircle, XCircle, MessageCircle, Share2 } from 'lucide-react';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    if (id) {
      const fetchedProduct = getProductById(id);
      if (!fetchedProduct) {
        notFound();
      } else {
        setProduct(fetchedProduct);
      }
    }
  }, [id]);

  if (!product) return null;

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out ${product.name} at Simba Supermarket!`;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground">{product.name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit text-sm">
              {product.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-bold">
              {product.price.toLocaleString('en-US')} RWF
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-500">In Stock</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-red-500">Out of Stock</span>
              </>
            )}
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-6 pt-6 border-t">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center h-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={handleIncrease}
                  disabled={!product.inStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg"
              onClick={() => addToCart(product, quantity)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {t('addToCart')}
            </Button>
            
            {/* Social Share */}
            <div className="pt-4 flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
