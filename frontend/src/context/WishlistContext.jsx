import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/wishlist');
            setWishlist(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const { data } = await api.post(`/wishlist/${productId}`);
            setWishlist(data);
            return { success: true, message: 'Added to wishlist' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to add to wishlist' };
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await api.delete(`/wishlist/${productId}`);
            setWishlist(data);
            return { success: true, message: 'Removed from wishlist' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to remove from wishlist' };
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    const clearWishlist = async () => {
        try {
            await api.delete('/wishlist');
            setWishlist([]);
            return { success: true, message: 'Wishlist cleared' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to clear wishlist' };
        }
    };

    const value = {
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        fetchWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
