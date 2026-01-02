import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AdminProducts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Fruits',
        customCategory: '',
        stock: '',
        unit: 'kg',
        discount: 0,
        isFeatured: false
    });

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use custom category if provided, otherwise use selected category
            const submitData = {
                ...formData,
                category: showCustomCategory && formData.customCategory
                    ? formData.customCategory
                    : formData.category
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, submitData);
            } else {
                await api.post('/products', submitData);
            }
            setShowAddModal(false);
            setEditingProduct(null);
            setShowCustomCategory(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert('Error saving product: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const handleEdit = (product) => {
        const predefinedCategories = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Grains'];
        const isCustomCategory = !predefinedCategories.includes(product.category);

        setEditingProduct(product);
        setShowCustomCategory(isCustomCategory);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: isCustomCategory ? 'Custom' : product.category,
            customCategory: isCustomCategory ? product.category : '',
            stock: product.stock,
            unit: product.unit,
            discount: product.discount || 0,
            isFeatured: product.isFeatured || false
        });
        setShowAddModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            image: '',
            category: 'Fruits',
            customCategory: '',
            stock: '',
            unit: 'kg',
            discount: 0,
            isFeatured: false
        });
        setShowCustomCategory(false);
    };

    if (loading) {
        return <div className="min-h-screen py-8" ><p className="text-white text-center">Loading...</p></div>;
    }

    return (
        <div className="min-h-screen py-8" >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Manage Products</h1>
                    <button onClick={() => { resetForm(); setShowAddModal(true); }} className="btn-primary">
                        + Add Product
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <div key={product._id} className="card p-3">
                            <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                            <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-white text-xs mb-1">{product.category}</p>
                            <p className="text-primary-500 font-bold mb-3 text-sm">₹{product.price} / {product.unit}</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(product)} className="btn-secondary flex-1 text-sm py-1.5">Edit</button>
                                <button onClick={() => handleDelete(product._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-white mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white mb-2">Name</label>
                                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Price</label>
                                        <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input-field" required />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData({ ...formData, category: value });
                                                setShowCustomCategory(value === 'Custom');
                                            }}
                                            className="input-field"
                                        >
                                            <option>Fruits</option>
                                            <option>Vegetables</option>
                                            <option>Dairy</option>
                                            <option>Bakery</option>
                                            <option>Grains</option>
                                            <option>Custom</option>
                                        </select>
                                        {showCustomCategory && (
                                            <input
                                                type="text"
                                                value={formData.customCategory}
                                                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                                placeholder="Enter custom category"
                                                className="input-field mt-2"
                                                required
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Stock</label>
                                        <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="input-field" required />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Unit</label>
                                        <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="input-field" required />
                                    </div>
                                    <div>
                                        <label className="block text-white mb-2">Discount (%)</label>
                                        <input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="input-field" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white mb-2">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="3" required />
                                </div>
                                <div>
                                    <label className="block text-white mb-2">Image URL</label>
                                    <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="input-field" required />
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="mr-2" />
                                    <label className="text-white">Featured Product</label>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="btn-primary flex-1">Save</button>
                                    <button type="button" onClick={() => { setShowAddModal(false); setEditingProduct(null); }} className="btn-secondary flex-1">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
