'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { X, ShoppingCart, Minus, Plus, Heart, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ToastProvider';
import { Product } from '@/types';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewProps) {
  const { t } = useTranslation();
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const wishlist = useStore((state) => state.wishlist) || [];
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!product) return null;

  const isFavorited = wishlist.includes(product.id);
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.id}` : '';
  const shareText = `Check out ${product.name} at Simba Supermarket!`;

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    const name = t(`products.${product.id}.name`, { defaultValue: product.name });
    showToast(isFavorited ? `${name} ${t('removedFromWishlist')}` : `♥ ${name} ${t('addedToWishlist')}`);
  };

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    const name = t(`products.${product.id}.name`, { defaultValue: product.name });
    showToast(`✓ ${name} (x${quantity}) ${t('addedToCart')}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-14 z-20 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-muted transition-colors hidden md:block"
        >
          <Heart className={`h-5 w-5 transition-colors duration-200 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
        </button>

        <div className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto">
          {/* Image */}
          <div className="relative w-full md:w-1/2 aspect-square bg-muted shrink-0">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col p-6 md:p-8 flex-1 justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {t(product.category.toLowerCase().replace(' ', '_'))}
                </p>
                <h2 className="text-2xl font-bold leading-tight">
                  {t(`products.${product.id}.name`, { defaultValue: product.name })}
                </h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`products.${product.id}.description`, { defaultValue: product.description })}
              </p>
              <p className="text-3xl font-extrabold text-primary">
                {product.price.toLocaleString('en-US')} <span className="text-base font-semibold">RWF</span>
              </p>
              {product.inStock ? (
                <span className="inline-block text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  ● {t('inStock', { defaultValue: 'In Stock' })}
                </span>
              ) : (
                <span className="inline-block text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                  ● {t('outOfStock')}
                </span>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Qty:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    className="p-2 hover:bg-muted transition-colors rounded-l-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    className="p-2 hover:bg-muted transition-colors rounded-r-lg"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                className="w-full font-bold text-primary-foreground gap-1.5 sm:gap-2 text-sm sm:text-base py-3 sm:py-5 h-auto flex flex-wrap justify-center whitespace-normal disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 leading-tight"
                onClick={handleAdd}
                disabled={!product.inStock}
              >
                {product.inStock ? (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {t('addToCart')} — {(product.price * quantity).toLocaleString('en-US')} RWF
                  </>
                ) : (
                  <span className="font-semibold text-lg">{t('outOfStock')}</span>
                )}
              </Button>
            </div>
            
            {/* Social Share */}
            <div className="mt-4 pt-4 border-t flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
