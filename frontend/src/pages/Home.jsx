import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import OfferBanner from '../components/OfferBanner';

const Home = () => {
    const { user } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, offersRes] = await Promise.all([
                    api.get('/products/featured'),
                    api.get('/offers')
                ]);
                setFeaturedProducts(productsRes.data);
                setOffers(offersRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div
            className="min-h-screen relative"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="bg-transparent text-white py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl bg-black bg-opacity-40 backdrop-blur-md p-8 rounded-2xl">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                                Fresh Groceries
                                <br />
                                <span className="text-white">Delivered to Your Door</span>
                            </h1>
                            <p className="text-xl mb-8 text-primary-100 animate-slide-up">
                                Shop from a wide range of fresh products with exclusive offers and deals.
                                Save more, enjoy more!
                            </p>
                            <div className="flex flex-wrap gap-4 animate-slide-up">
                                <Link to="/products">
                                    <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                        {user?.isAdmin ? 'See Products →' : 'Shop Now →'}
                                    </button>
                                </Link>
                                <Link to="/offers">
                                    <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                        View Offers
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Hidden for Admin */}
                {!user?.isAdmin && (
                    <section className="py-16 bg-transparent">
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center p-6 bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-xl border border-gray-700">
                                    <div className="w-16 h-16 bg-primary-600 bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-500 border-opacity-30">
                                        <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-white">Best Prices</h3>
                                    <p className="text-white">Competitive prices with exclusive offers and discounts</p>
                                </div>

                                <div className="text-center p-6 bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-xl border border-gray-700">
                                    <div className="w-16 h-16 bg-primary-600 bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-500 border-opacity-30">
                                        <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-white">Fast Delivery</h3>
                                    <p className="text-white">Quick and reliable delivery to your doorstep</p>
                                </div>

                                <div className="text-center p-6 bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-xl border border-gray-700">
                                    <div className="w-16 h-16 bg-primary-600 bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-500 border-opacity-30">
                                        <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-white">Fresh Quality</h3>
                                    <p className="text-white">100% fresh and quality products guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Offers Section */}
                {offers.length > 0 && (
                    <section className="py-16 bg-transparent">
                        <div className="container mx-auto px-4">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold">🎉 Special Offers</h2>
                                <Link to="/offers" className="text-primary-600 hover:text-primary-700 font-semibold">
                                    View All →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {offers.slice(0, 2).map((offer) => (
                                    <OfferBanner key={offer._id} offer={offer} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Featured Products */}
                <section className="py-16 bg-transparent">

                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-white">Featured Products</h2>
                            <Link to="/products" className="text-primary-400 hover:text-primary-300 font-semibold">
                                View All →
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="card h-96">
                                        <div className="skeleton h-48"></div>
                                        <div className="p-4 space-y-3">
                                            <div className="skeleton h-4 w-3/4"></div>
                                            <div className="skeleton h-4 w-1/2"></div>
                                            <div className="skeleton h-8 w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-transparent text-white">
                    <div className="container mx-auto px-4 text-center bg-black bg-opacity-40 backdrop-blur-md p-12 rounded-2xl max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4">
                            {user?.isAdmin ? 'Ready to See the Products?' : 'Ready to Start Shopping?'}
                        </h2>
                        <p className="text-xl mb-8 text-primary-100">
                            {user?.isAdmin
                                ? 'Manage your product catalog and keep your inventory up to date'
                                : 'Join thousands of happy customers enjoying fresh groceries with amazing deals'
                            }
                        </p>
                        <Link to="/products">
                            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Browse Products →
                            </button>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
