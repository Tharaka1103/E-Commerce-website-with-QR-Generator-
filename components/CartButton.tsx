'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useCart } from '@/contexts/CartContext'

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart()

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-primary text-black p-3 md:p-4 rounded-full shadow-black z-50 animate-bounce"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm">
            {totalItems}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full sm:max-w-[380px] md:max-w-md bg-background shadow-xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-background p-4 md:p-6 border-b">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Your Cart</h2>
                  <button onClick={() => setIsOpen(false)} className="p-1">
                    <X className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6">
                {items.length === 0 ? (
                  <div className="text-center py-8 md:py-12 px-4">
                    <ShoppingCart className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-base md:text-lg mb-3">Your cart is looking a bit empty</p>
                    <p className="text-sm md:text-base text-muted-foreground/80 mb-6">Let's add some delicious items!</p>
                    <Button
                          onClick={() => {
                            setIsOpen(false)
                            router.push('/menu')
                          }}
                          className="w-full max-w-xs text-sm md:text-base py-3 md:py-4 hover:scale-105 transition-transform"
                    >
                          Browse Menu
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 md:mb-6">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-3 md:gap-4 mb-3 md:mb-4 p-3 md:p-4 bg-muted rounded-lg">
                          <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="rounded-md object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>
                            <p className="text-primary text-sm md:text-base">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="p-1 rounded-md hover:bg-muted-foreground/20"
                              >
                                <Minus className="h-3 w-3 md:h-4 md:w-4" />
                              </button>
                              <span className="text-sm md:text-base">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-md hover:bg-muted-foreground/20"
                              >
                                <Plus className="h-3 w-3 md:h-4 md:w-4" />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="ml-auto p-1 text-red-500 hover:bg-red-500/20 rounded-md"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="sticky bottom-0 bg-background pt-4 border-t">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold text-sm md:text-base">Total:</span>
                        <span className="font-bold text-sm md:text-base">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="grid gap-2">
                        <Button
                          onClick={() => {
                            setIsOpen(false)
                            router.push('/cart')
                          }}
                          variant="outline"
                          className="w-full text-sm md:text-base py-2 md:py-3"
                        >
                          View Cart
                        </Button>
                        <Button 
                        className="w-full text-sm md:text-base py-2 md:py-3"
                        onClick={() => {
                            setIsOpen(false)
                            router.push('/cart/checkout')
                          }}
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
