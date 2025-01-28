// AddProductForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AddProductForm({ initialData, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        discount: initialData?.discount || '',
        tag: initialData?.tag || '',
        image: initialData?.image || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (initialData) {
                await axios.patch(
                    `https://luxe-store.onrender.com/api/v1/products/update/${initialData._id}`,
                    formData,
                    { withCredentials: true }
                );
            } else {
                await axios.post(
                    "https://luxe-store.onrender.com/api/v1/products/create-product",
                    formData,
                    { withCredentials: true }
                );
            }
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded">
                    {error}
                </div>
            )}

            {Object.entries({
                name: 'Product Name',
                description: 'Description',
                price: 'Price',
                discount: 'Discount',
                tag: 'Tag',
                image: 'Image URL'
            }).map(([field, label]) => (
                <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                    <input
                        type={field === 'price' ? 'number' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            ))}

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'Processing...' : initialData ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}

export default AddProductForm;