// ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import AddProductForm from './AddProductForm'

const ProductManagement = () => {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showAddForm, setShowAddForm] = useState(false);
   const [editingProduct, setEditingProduct] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');

   const fetchProducts = async () => {
       try {
           const response = await axios.get('http://localhost:5174/api/v1/products/all-products');
           setProducts(response.data.data.products);
       } catch (error) {
           console.error('Error:', error);
       } finally {
           setLoading(false);
       }
   };

   useEffect(() => {
       fetchProducts();
   }, []);

   const filteredProducts = products.filter(product => 
       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.tag.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const handleDelete = async (productId) => {
       if (window.confirm('Are you sure you want to delete this product?')) {
           try {
               await axios.delete(`http://localhost:5174/api/v1/products/${productId}`, {
                   withCredentials: true
               });
               await fetchProducts();
           } catch (error) {
               console.error('Error:', error);
           }
       }
   };

   return (
       <div className="space-y-4 p-6">
           <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold">Products</h2>
               <div className="flex gap-4">
                   <input
                       type="text"
                       placeholder="Search products..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="px-4 py-2 border rounded-lg"
                   />
                   <button 
                       onClick={() => {
                           setEditingProduct(null);
                           setShowAddForm(true);
                       }}
                       className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                   >
                       <Plus size={20} />
                       Add Product
                   </button>
               </div>
           </div>

           {showAddForm && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                   <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                       <div className="flex justify-between items-center mb-4">
                           <h3 className="text-xl font-bold">
                               {editingProduct ? 'Edit Product' : 'Add New Product'}
                           </h3>
                           <button 
                               onClick={() => {
                                   setShowAddForm(false);
                                   setEditingProduct(null);
                               }}
                               className="text-gray-500 hover:text-gray-700"
                           >
                               ✕
                           </button>
                       </div>
                       <AddProductForm 
                           initialData={editingProduct}
                           onSuccess={() => {
                               setShowAddForm(false);
                               setEditingProduct(null);
                               fetchProducts();
                           }}
                           onCancel={() => {
                               setShowAddForm(false);
                               setEditingProduct(null);
                           }}
                       />
                   </div>
               </div>
           )}

           {loading ? (
               <div className="text-center py-4">Loading...</div>
           ) : (
               <div className="bg-white rounded-lg shadow overflow-hidden">
                   <div className="overflow-x-auto">
                       <table className="w-full">
                           <thead className="bg-gray-50">
                               <tr>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                               </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                               {filteredProducts.map((product) => (
                                   <tr key={product._id} className="hover:bg-gray-50">
                                       <td className="px-6 py-4 whitespace-nowrap">
                                           <img 
                                               src={product.image} 
                                               alt={product.name}
                                               className="h-16 w-16 object-cover rounded"
                                           />
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                           <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                           <div className="text-sm text-gray-500">{product.description}</div>
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                           ${product.price}
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                           {product.discount}
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                           {product.tag}
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                           <div className="flex gap-3">
                                               <button
                                                   onClick={() => {
                                                       setEditingProduct(product);
                                                       setShowAddForm(true);
                                                   }}
                                                   className="text-blue-600 hover:text-blue-900"
                                               >
                                                   <Edit size={20} />
                                               </button>
                                               <button
                                                   onClick={() => handleDelete(product._id)}
                                                   className="text-red-600 hover:text-red-900"
                                               >
                                                   <Trash2 size={20} />
                                               </button>
                                           </div>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           )}
       </div>
   );
};

export default ProductManagement;