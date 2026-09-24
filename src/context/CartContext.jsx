"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Səhifə ilk açılanda localStorage-dən məlumatı təhlükəsiz oxumaq
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gameX_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (error) {
      console.error("Səbət məlumatları oxunarkən xəta baş verdi:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Yalnız ilkin oxunma bitdikdən sonra dəyişiklikləri localStorage-ə yazmaq
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("gameX_cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Səbət yaddaşa yazılarkən xəta:", error);
      }
    }
  }, [cartItems, isLoaded]);

  // Səbətə məhsul əlavə etmək
  const addToCart = (product) => {
    if (!product) return;

    // Qiyməti təmiz rəqəmə çeviririk (string və ya number ola bilər)
    const numericPrice =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^\d.-]/g, "")) || 0
        : Number(product.price) || 0;

    const normalizedProduct = {
      ...product,
      price: numericPrice,
      image: product.image || product.img || "/EA.jpg",
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Məhsul artıq səbətdə varsa, sadəcə sayını artırırıq
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }

      // Yeni məhsul əlavə edirik
      return [...prevItems, { ...normalizedProduct, quantity: 1 }];
    });
  };

  // Səbətdən məhsul silmək
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Məhsulun sayını artırmaq və ya azaltmaq
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = (item.quantity || 1) + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  // Səbəti tamamilə təmizləmək (Ödənişdən sonra)
  const clearCart = () => {
    setCartItems([]);
  };

  // Ümumi məbləğ
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0,
  );

  // Ümumi ədəd sayı
  const totalCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalCount,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Xüsusi Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart mütləq CartProvider daxilində istifadə olunmalıdır!",
    );
  }
  return context;
};
