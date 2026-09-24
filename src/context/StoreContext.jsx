"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // Current user state
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    if (auth?.user) {
      setUser(auth.user);
    }
  }, [auth?.user]);

  // Data states
  const [games, setGames] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutInitialItem, setCheckoutInitialItem] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [selectedGameForTrailer, setSelectedGameForTrailer] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Initial Load: User from localStorage & Cart
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('nexus_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedCart = localStorage.getItem('nexus_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Local storage error:", e);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nexus_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('nexus_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('nexus_user');
      }
    } catch (e) {}
  }, [user]);

  // 2. Fetch Games
  const refreshGames = async () => {
    try {
      const res = await fetch('/api/games');
      const data = await res.json();
      if (data.success && data.games) {
        setGames(data.games);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  // 3. Fetch Accounts
  const refreshAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      if (data.success && data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  // 4. Fetch User Orders
  const refreshOrders = useCallback(async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'admin' ? '/api/orders' : `/api/orders?userId=${user.id}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }, [user]);

  useEffect(() => {
    refreshGames();
    refreshAccounts();
  }, []);

  useEffect(() => {
    if (user) {
      refreshOrders();
    } else {
      setOrders([]);
    }
  }, [user, refreshOrders]);

  // Auth actions
  const login = async (email, password) => {
    try {
      if (auth?.login) {
        const u = await auth.login(email, password);
        setUser(u);
        setIsAuthModalOpen(false);
        showToast(`Xoş gəldiniz, ${u.name || u.fullName}!`, 'success');
        return { success: true };
      }
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        showToast(data.message || `Xoş gəldiniz, ${data.user.name}!`, 'success');
        return { success: true };
      } else {
        showToast(data.error || "Giriş uğursuz oldu!", 'error');
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast(err.message || "Serverlə əlaqə xətası!", 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      if (auth?.register) {
        const u = await auth.register(name, email, password);
        setUser(u);
        setIsAuthModalOpen(false);
        showToast("Qeydiyyat uğurludur! 50 ₼ bonus balans verildi.", 'success');
        return { success: true };
      }
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        showToast(data.message || "Qeydiyyat uğurludur! 50 ₼ bonus balans verildi.", 'success');
        return { success: true };
      } else {
        showToast(data.error || "Qeydiyyat xətası!", 'error');
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast(err.message || "Serverlə əlaqə xətası!", 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    if (auth?.logout) {
      await auth.logout();
    }
    setUser(null);
    showToast("Hesabdan uğurla çıxış edildi", 'info');
  };

  // Profile update (Admin or User can edit their name, email, password)
  const updateProfile = async ({ name, email, password }) => {
    if (!user) {
      showToast("Giriş tələb olunur!", 'error');
      return { success: false, error: "Giriş tələb olunur" };
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: name?.trim(),
          email: email?.trim(),
          password: password ? password.trim() : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        showToast(data.message || "Profil məlumatlarınız uğurla yeniləndi!", 'success');
        return { success: true, user: data.user };
      } else {
        showToast(data.error || "Profil yenilənmədi!", 'error');
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast("Server xətası baş verdi!", 'error');
      return { success: false, error: err.message };
    }
  };

  // Update a user as admin
  const updateUserAsAdmin = async (id, userData) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...userData })
      });
      const data = await res.json();
      if (data.success) {
        if (user && user.id === id) {
          setUser(data.user);
        }
        showToast(data.message || "İstifadəçi məlumatları yeniləndi!", 'success');
        return { success: true, user: data.user };
      } else {
        showToast(data.error || "Xəta baş verdi!", 'error');
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast("Server xətası baş verdi!", 'error');
      return { success: false, error: err.message };
    }
  };

  // Delete account (by owner or admin)
  const deleteAccount = async (id) => {
    try {
      const res = await fetch(`/api/accounts?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(prev => prev.filter(a => String(a.id) !== String(id)));
        showToast("Hesab elanı uğurla silindi!", 'info');
        return { success: true };
      } else {
        showToast(data.error || "Silinmə zamanı xəta baş verdi!", 'error');
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast("Server xətası baş verdi!", 'error');
      return { success: false, error: err.message };
    }
  };

  // Cart actions
  const addToCart = (item) => {
    const exists = cart.find(c => String(c.id) === String(item.id));
    if (exists) {
      showToast(`"${item.title}" artıq səbətdədir!`, 'info');
      setIsCartOpen(true);
      return;
    }
    const cartItem = {
      id: item.id,
      title: item.title,
      price: Number(item.price),
      type: item.game ? 'Hesab' : 'Oyun Açarı',
      image: item.image,
      platform: item.platform || item.game,
      credentials: item.credentials || null
    };
    setCart(prev => [...prev, cartItem]);
    showToast(`"${item.title}" səbətə əlavə edildi!`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(c => String(c.id) !== String(id)));
    showToast("Məhsul səbətdən silindi", 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Instant direct buy (bypassing or using cart)
  const openDirectCheckout = (item) => {
    const checkoutItem = {
      id: item.id,
      title: item.title,
      price: Number(item.price),
      type: item.game ? 'Hesab' : 'Oyun Açarı',
      image: item.image,
      platform: item.platform || item.game,
      credentials: item.credentials || null
    };
    setCheckoutInitialItem(checkoutItem);
    setIsCheckoutModalOpen(true);
  };

  // Wallet top up
  const topUpWallet = async (amount, paymentMethod) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return { success: false, error: "Daxil olmalısınız" };
    }

    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount, paymentMethod })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setIsTopUpModalOpen(false);
        showToast(data.message, 'success');
        return { success: true };
      } else {
        showToast(data.error, 'error');
        return { success: false, error: data.error };
      }
    } catch (err) {
      showToast("Balans artırılarkən xəta baş verdi", 'error');
      return { success: false, error: err.message };
    }
  };

  // Create Order
  const createOrder = async (orderPayload) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        if (data.updatedUser) {
          setUser(data.updatedUser);
        }
        refreshOrders();
        return { success: true, order: data.order, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Open trailer modal
  const openTrailerModal = (game) => {
    setSelectedGameForTrailer(game);
    setIsTrailerModalOpen(true);
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        isLoadingUser,
        login,
        register,
        logout,
        updateProfile,
        updateUserAsAdmin,
        deleteAccount,
        games,
        accounts,
        orders,
        refreshGames,
        refreshAccounts,
        refreshOrders,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        checkoutInitialItem,
        setCheckoutInitialItem,
        openDirectCheckout,
        isSellModalOpen,
        setIsSellModalOpen,
        isTopUpModalOpen,
        setIsTopUpModalOpen,
        isTrailerModalOpen,
        setIsTrailerModalOpen,
        selectedGameForTrailer,
        openTrailerModal,
        topUpWallet,
        createOrder,
        toast,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
