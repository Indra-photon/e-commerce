import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, ShoppingCart, Menu, X, Heart, Link } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sample data with real images from Pexels
  const categories = [
    { name: 'Sling Bag', image: 'https://cdn.pixabay.com/photo/2022/09/04/08/31/fashion-7431099_1280.jpg' },
    { name: 'Duffle Bag', image: 'https://cdn.pixabay.com/photo/2017/04/05/01/12/traveler-2203666_1280.jpg' },
    { name: 'Saddle Bag', image: 'https://cdn.pixabay.com/photo/2016/11/29/01/36/businessman-1866582_640.jpg' },
    { name: 'Tote Bag', image: 'https://cdn.pixabay.com/photo/2021/10/26/13/29/bag-6743886_640.jpg' },
    { name: 'Cross Body', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg' },
    { name: 'Clutch', image: 'https://cdn.pixabay.com/photo/2015/11/19/08/46/bag-1050608_640.jpg' },
    { name: 'Satchel', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg' },
    { name: 'Hobo Bag', image: 'https://cdn.pixabay.com/photo/2014/07/31/23/42/handbag-407198_640.jpg' }
  ];

  const products = [
    { 
      id: 1, 
      name: 'Premium Cotton Tee', 
      price: 29.99, 
      image: 'https://cdn.pixabay.com/photo/2016/11/23/18/12/bag-1854148_1280.jpg',
      discount: '20% OFF'
    },
    { 
      id: 2, 
      name: 'Designer Denim', 
      price: 89.99, 
      image: 'https://cdn.pixabay.com/photo/2014/07/31/23/42/handbag-407198_1280.jpg'
    },
    { 
      id: 3, 
      name: 'Summer Collection', 
      price: 59.99, 
      image: 'https://cdn.pixabay.com/photo/2015/11/20/03/53/package-1052370_640.jpg',
      discount: 'NEW'
    },
    { 
      id: 4, 
      name: 'Urban Jacket', 
      price: 199.99, 
      image: 'https://cdn.pixabay.com/photo/2015/05/14/20/51/bag-767346_640.jpg',
      discount: 'TRENDING'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.h1 
            className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Elevate Your <br />
            <span className="text-purple-400">Style Game</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 font-light max-w-lg"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            Discover our curated collection of premium fashion pieces.
          </motion.p>
          <a href='/shop-page'>
            <motion.button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:opacity-90 transition-opacity"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Collection
            </motion.button>
          </a>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-playfair font-bold text-center mb-12"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                className="relative rounded-xl overflow-hidden group cursor-pointer"
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-purple-300 text-sm">View Collection →</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-playfair font-bold text-center mb-12"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
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
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LUXE
              </h3>
              <p className="text-gray-400">Elevating your style with premium fashion pieces.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Categories</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Men</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Women</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Kids</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4">Stay updated with our latest collections and offers.</p>
              <div className="max-w-full">
                <form className="flex max-w-md" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="min-w-0 flex-2 px-4 py-2 rounded-l-full bg-gray-800 text-white focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-r-full hover:opacity-90 transition-opacity"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 LUXE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;