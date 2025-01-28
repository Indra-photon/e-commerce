import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown, Heart, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

const ShopPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ProductItems, setProductItems] = useState([])
  
  // Sample data
  const categories = [
    { id: 'all', name: 'All', count: 86 },
    { id: 'Sling Bag', name: 'Sling Bag', count: 24 },
    { id: 'Duffle Bag', name: 'Duffle Bag', count: 18 },
    { id: 'Saddle Bag', name: 'Saddle Bag', count: 12 },
    { id: 'Tote Bag', name: 'Tote Bag', count: 14 },
    { id: 'Cross Body', name: 'Cross Body', count: 10 },
    { id: 'Clutch', name: 'Clutch', count: 8 },
    { id: 'Satchel', name: 'Satchel', count: 8 },
    { id: 'Hobo Bag', name: 'Hobo Bag', count: 8 },
    
  ];

  // Sample filter sections
  const filters = [
    {
      name: 'Price Range',
      options: ['Under $50', '$50 - $100', '$100 - $200', 'Over $200']
    },
    {
      name: 'Color',
      options: ['Black', 'White', 'Blue', 'Red', 'Green']
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await axios.get("https://luxe-store.onrender.com/api/v1/products/get-product")
        console.log(fetchedProducts.data.data);
        if (fetchedProducts) {
          setProductItems(fetchedProducts.data.data)
          // console.log(ProductItems);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts()

  }, [])

  const addCart = async (productId) => {
    try {
      const addCart = await axios.post("https://luxe-store.onrender.comapi/v1/carts/addCart", {productId}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (addCart) {
        alert("Product added to cart successfully")
      }
    } catch (error) {
      console.log("Error adding cart:", error.response.data);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-playfair font-bold text-gray-900">Shop</h1>
          <p className="mt-2 text-gray-600">Discover our curated collection</p>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center space-x-2 text-gray-600"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
          {/* Mobile Filter Sidebar */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 flex z-40 lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileFilterOpen(false)} />
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile Filters */}
                <div className="mt-4 border-t border-gray-200">
                  {/* Categories */}
                  <div className="px-4 py-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Categories</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <button
                            onClick={() => setSelectedCategory(category.name)}
                            className={`text-sm ${
                              selectedCategory === category.name
                                ? 'text-purple-600 font-medium'
                                : 'text-gray-600'
                            }`}
                          >
                            {category.name} ({category.count})
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Filters */}
                  {filters.map((section) => (
                    <div key={section.name} className="px-4 py-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">{section.name}</h3>
                      <div className="space-y-3">
                        {section.options.map((option) => (
                          <div key={option} className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <label className="ml-3 text-sm text-gray-600">{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCategory(category.name)}
                        className={`text-sm ${
                          selectedCategory === category.name
                            ? 'text-purple-600 font-medium'
                            : 'text-gray-600'
                        } hover:text-purple-600 transition-colors`}
                      >
                        {category.name}
                      </button>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Filters */}
              {filters.map((section) => (
                <div key={section.name} className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">{section.name}</h3>
                  <div className="space-y-3">
                    {section.options.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label className="ml-3 text-sm text-gray-600">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* {Array.from({ length: 9 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src="/api/placeholder/300/400"
                      alt="Product"
                      className="w-full h-72 object-cover object-center"
                    />
                    {index % 3 === 0 && (
                      <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                        New
                      </div>
                    )}
                    <button className="absolute top-4 right-4 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="text-purple-600" size={20} />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-gray-900 mb-2">Stylish Product {index + 1}</h3>
                    <p className="text-purple-600 font-medium mb-4">$199.99</p>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                      <ShoppingCart size={18} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </motion.div>
              ))} */}
              {ProductItems.map((product, index) => (
                <motion.div
                    key={product._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden group"
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeIn}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-80 object-cover"
                    />
                    {product.discount && (
                        <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                        {product.discount}
                        </div>
                    )}
                    <button className="absolute top-4 right-4 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="text-purple-600" size={20} />
                    </button>
                    </div>
                    <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                    <p className="text-purple-600 font-medium mb-4">${product.price}</p>
                    <button 
                    onClick={()=>addCart(product._id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                    </button>
                    </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;