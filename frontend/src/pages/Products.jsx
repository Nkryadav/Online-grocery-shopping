import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword, category, page]);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/products/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/products', {
                params: { keyword, category, page }
            });
            setProducts(data.products);
            setPages(data.pages);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (cat) => {
        setPage(1);
        const newParams = new URLSearchParams(searchParams);
        if (cat) {
            newParams.set('category', cat);
        } else {
            newParams.delete('category');
        }
        setSearchParams(newParams);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchKeyword = formData.get('search');
        setPage(1);
        const newParams = new URLSearchParams(searchParams);
        if (searchKeyword) {
            newParams.set('keyword', searchKeyword);
        } else {
            newParams.delete('keyword');
        }
        setSearchParams(newParams);
    };

    return (
        <div
            className="min-h-screen py-8 relative"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-0"></div>
            <div className="relative z-10">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">All Products</h1>
                            <p className="text-white">Browse our wide selection of fresh groceries</p>
                        </div>
                        {user?.isAdmin && (
                            <Link to="/admin/products" className="btn-primary">
                                Manage Products
                            </Link>
                        )}
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={keyword}
                                    placeholder="Search products..."
                                    className="input-field pl-12"
                                />
                                <svg className="w-6 h-6 text-white absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button type="submit" className="btn-primary">
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Category Filter */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Categories</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleCategoryChange('')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${!category
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-gray-700 text-gray-100 hover:bg-gray-600 hover:shadow-lg'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${category === cat
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-700 text-gray-100 hover:bg-gray-600 hover:shadow-lg'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-white">
                            Showing {products.length} of {total} products
                        </p>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(12)].map((_, i) => (
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
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-24 h-24 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
                            <p className="text-white">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pages > 1 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(pages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setPage(i + 1)}
                                            className={`px-4 py-2 rounded-lg transition-all ${page === i + 1
                                                ? 'bg-primary-600 text-white shadow-lg'
                                                : 'bg-gray-700 text-gray-100 hover:bg-gray-600 hover:shadow-lg'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === pages}
                                        className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
