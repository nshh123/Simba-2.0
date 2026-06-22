'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart, Bookmark } from 'lucide-react';

export function CartDrawer() {
  const router = useRouter();
  const { t } = useTranslation();
  const { cart, savedForLater = [], isCartOpen, setCartOpen, updateQuantity, removeFromCart, clearCart, saveForLater, moveToCart, removeFromSaved } = useStore();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <SheetTitle>{t('yourCart')}</SheetTitle>
          {cart.length > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </SheetHeader>
        
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-4 text-center">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-2">
              <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold">{t('emptyCart')}</h3>
            <p className="text-muted-foreground text-sm max-w-xs">Looks like you haven't added anything to your cart yet.</p>
            <Button size="lg" className="font-bold mt-4" onClick={() => setCartOpen(false)}>
              Go to Shop
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted shrink-0">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <span className="font-medium line-clamp-1">{t(`products.${item.id}.name`, { defaultValue: item.name })}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary" onClick={() => saveForLater(item.id)} title="Save for later">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-6 w-6 shrink-0" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6 shrink-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-medium">{(item.price * item.quantity).toLocaleString('en-US')} RWF</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Saved for Later Shelf */}
              {savedForLater.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3">Saved for Later ({savedForLater.length})</h4>
                  <div className="space-y-4">
                    {savedForLater.map((item) => (
                      <div key={item.id} className="flex gap-4 opacity-75 hover:opacity-100 transition-opacity">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                          {item.imageUrl && (
                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm line-clamp-1">{t(`products.${item.id}.name`, { defaultValue: item.name })}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromSaved(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-medium text-sm">{(item.price * item.quantity).toLocaleString('en-US')} RWF</span>
                            <Button variant="secondary" size="sm" className="h-7 text-xs font-bold" onClick={() => moveToCart(item.id)}>
                              Move to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="pt-6 pb-2 border-t mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">{t('total')}</span>
                <span className="font-bold text-lg">{total.toLocaleString('en-US')} RWF</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                {t('checkout')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
