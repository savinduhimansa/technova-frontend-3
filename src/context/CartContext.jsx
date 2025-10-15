import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_items");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(it => it.productId === product.productId);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.productId,
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          quantity: qty,
          stock: product.stock ?? 0,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(it => it.productId !== productId));
  };

  const updateQty = (productId, qty) => {
    setItems(prev => prev.map(it => it.productId === productId ? { ...it, quantity: qty } : it));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateQty, clearCart, subtotal }),
    [items, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
