import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Cart = ({
  cart,
  showCart,
  totalAmount,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onOrderSuccess,
}) => {
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!showCart) return null;

  const handleInputChange = (e) => {
    setCustomerDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUPIPayment = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!customerDetails.name || !customerDetails.address || !customerDetails.phone) {
      toast.error('Please fill all required fields (Name, Address, Phone)');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Failed to load Razorpay SDK. Check your connection.");
        setIsProcessing(false);
        return;
      }

      const orderResponse = await fetch("https://slice-hub-backend.vercel.app/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Slice Hub Pizza App",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // ✅ Verify payment with backend
            const verifyRes = await fetch("https://slice-hub-backend.vercel.app/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Generate local order ID
              const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

              // ✅ Show success and close cart
              onOrderSuccess({
                customerDetails,
                cart,
                totalAmount,
                paymentData: response,
                paymentMethod: "Online Payment - Paid",
                orderId,
              });

              // toast.success(`Order placed successfully! Order ID: ${orderId}`);
              setCustomerDetails({ name: "", address: "", phone: "", email: "" });
              onClose();
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            toast.error("Something went wrong while verifying payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        theme: { color: "#f97316" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Error initiating payment");
      setIsProcessing(false);
    }
  };

  const handleCashOnDelivery = async (e) => {
    e.preventDefault();

    if (!customerDetails.name || !customerDetails.address || !customerDetails.phone) {
      toast.error('Please fill all required fields (Name, Address, Phone)');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Generate local order ID
      const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      onOrderSuccess({
        customerDetails,
        cart,
        totalAmount,
        paymentData: null,
        paymentMethod: 'Cash on Delivery',
        orderId,
      });

      toast.success(`Order placed successfully! Order ID: ${orderId}`);
      setCustomerDetails({ name: '', address: '', phone: '', email: '' });
      onClose();
    } catch (error) {
      console.error("COD order error:", error);
      toast.error("Error placing order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full md:w-[900px] h-full bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">🛒 Checkout</h2>
          <button
            className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
            onClick={onClose}
            disabled={isProcessing}
          >
            ✕ Close
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-orange-500">Your cart is empty</p>
            <p className="text-6xl">🍕</p>
            <p className="text-gray-400 text-sm mt-2">Add some delicious pizzas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* LEFT SIDE → Cart Items + Total */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-orange-600 border-b pb-2">
                🍕 Your Cart
              </h3>

              {/* Cart Items */}
              <div className="space-y-3 max-h-94 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center bg-slate-200 gap-3 rounded-lg p-2 border border-gray-200"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover border"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-gray-500 text-xs">₹{item.price} each</p>

                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => onDecrement(item.name)}
                          className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-xs"
                          disabled={isProcessing}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-semibold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onIncrement(item.name)}
                          className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-xs"
                          disabled={isProcessing}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-orange-600 text-sm">
                        ₹{item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => onRemove(item.name)}
                        className="text-red-500 hover:text-red-700 text-xs mt-1"
                        title="Remove item"
                        disabled={isProcessing}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-orange-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE → Customer Details + Payment */}
            <form className="space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">
                  📋 Customer Details
                </h3>

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={customerDetails.name}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  required
                />

                <textarea
                  name="address"
                  placeholder="Delivery Address *"
                  value={customerDetails.address}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  rows="3"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email (Optional)"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                />
              </div>

              {/* Payment Buttons */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={handleUPIPayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "💳 Pay via UPI (GPay / Paytm / PhonePe)"}
                </button>

                <button
                  onClick={handleCashOnDelivery}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 rounded-lg transition text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "💰 Cash on Delivery"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
