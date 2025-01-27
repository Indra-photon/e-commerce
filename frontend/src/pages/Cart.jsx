import React, { useEffect, useState } from "react";
import { Trash2, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);



  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          "http://localhost:5174/api/v1/carts/getuserCart",
          { withCredentials: true }
        );
  
        if (response?.data?.data?.products) {
          setCartItems(response.data.data.products);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load cart. Please try again later.';
        setError(errorMessage);
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCart();
    
  }, []);

  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5174/api/v1/carts/product/${productId}`,
        { withCredentials: true }
      );
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId._id !== productId)
      );
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.patch(
        `http://localhost:5174/api/v1/carts/product/${productId}`,
        { qty: newQty },
        { withCredentials: true }
      );
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === productId ? { ...item, qty: newQty } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Function to handle payment
  const handlePayment = async () => {
    try {
      setPaymentLoading(true);

      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // 2. Create order on backend
      const orderResponse = await axios.post(
        "http://localhost:5174/api/v1/payment/create-order",
        {
          cartItems,
          totalAmount: calculateSubtotal()
        },
        { withCredentials: true }
      );

      const  order  = orderResponse.data.data;
      // console.log(order);
      

      // 3. Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Store Name",
        description: "Purchase Description",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 4. Verify payment on backend
            const verifyResponse = await axios.post(
              "http://localhost:5174/api/v1/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems
              },
              { withCredentials: true }
            );

            // 5. Handle success
            if (verifyResponse.data.success) {
              // Clear cart or redirect to success page
              alert("Payment successful!");
              // You might want to redirect to a success page or clear the cart
              // window.location.href = "/payment-success";
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.username || "",
          email: user.email || "",
        },
        theme: {
          color: "#3B82F6" // matches your blue-500 color
        }
      };

      // 6. Create Razorpay instance and open payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Could not initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="mr-2" size={20} />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="mr-2" size={24} />
            Your Cart ({cartItems.length})
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <ShoppingCart size={48} className="text-gray-400" />
              <p className="text-xl text-gray-500">Your cart is empty</p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-sm p-4">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.productId.image && (
                        <img 
                          src={item.productId.image} 
                          alt={item.productId.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.productId.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {item.productId.description}
                      </p>
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border rounded-lg px-2">
                      <button 
                        onClick={() => updateQuantity(item.productId._id, item.qty - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId._id, item.qty + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId._id)}
                      className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition mt-4">
                    {paymentLoading ? "Processing..." : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;