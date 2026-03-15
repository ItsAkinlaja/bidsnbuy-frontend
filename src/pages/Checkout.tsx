import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { authService } from '../services/auth';
import { useNotification } from '../context/NotificationContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  CheckCircle2,
  ChevronLeft,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { decodeHtml } from '../utils/decode';

type CheckoutStep = 'cart' | 'details' | 'payment' | 'success';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { showNotification } = useNotification();
  
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [loading, setLoading] = useState(false);
  const [user] = useState(() => authService.getUser());

  // Form State
  const [formData, setFormData] = useState({
    firstName: user?.user_display_name?.split(' ')[0] || '',
    lastName: user?.user_display_name?.split(' ')[1] || '',
    email: user?.user_email || '',
    phone: '',
    address: '',
    city: '',
    state: 'Lagos',
    zip: ''
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  
  // Dynamic Shipping Calculation based on State
  const getShippingCost = () => {
    const baseRate = shippingMethod === 'express' ? 5000 : 2500;
    // Example of dynamic logic: Lagos is cheaper, other states slightly more
    if (formData.state !== 'Lagos') {
      return baseRate + 1500;
    }
    return baseRate;
  };

  const shippingCost = getShippingCost();
  const grandTotal = cartTotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToDetails = () => {
    if (!authService.isAuthenticated()) {
      showNotification({
        title: 'Authentication Required',
        message: 'Please sign in to proceed with your order.',
        type: 'error'
      });
      // Optionally open auth modal here if we had a way to trigger it globally
      return;
    }
    setStep('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalPayment = async (method: 'paystack' | 'flutterwave') => {
    setLoading(true);
    
    // In a real implementation, we would call the Paystack/Flutterwave SDK here
    // Example flow:
    // 1. Create order in WordPress via WooCommerce REST API (if available)
    // 2. Initialize payment with the gateway
    // 3. Handle callback/webhook
    
    console.log(`Initializing ${method} payment for ₦${grandTotal}...`);

    // Simulate payment gateway delay
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showNotification({
        title: 'Order Placed!',
        message: `Your order has been successfully processed via ${method === 'paystack' ? 'Paystack' : 'Flutterwave'}.`,
        type: 'success'
      });
    }, 2500);
  };

  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in fade-in zoom-in duration-700 py-12">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 sm:mb-8 text-green-500">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4 text-center tracking-tight leading-tight">Thank you for your purchase!</h2>
        <p className="text-gray-500 font-medium mb-8 sm:mb-10 text-center max-w-md text-sm sm:text-base">
          Your order has been received and is being processed. We'll send you an email confirmation shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={() => navigate('/products')}
            className="flex-1 bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-blue/20"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/track-order')}
            className="flex-1 bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
          >
            Track Order
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 text-center">Your cart is empty</h2>
        <p className="text-gray-500 font-medium mb-8 text-center">Add some premium items to get started!</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-dark transition-all shadow-xl shadow-brand-blue/20"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20 pt-8 sm:pt-12">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Checkout Progress */}
        <div className="flex items-center justify-center mb-10 sm:mb-16 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-max px-4">
            <div className={`flex items-center space-x-2 ${step === 'cart' ? 'text-brand-blue' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[10px] sm:text-xs ${step === 'cart' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>1</div>
              <span className="font-black uppercase tracking-widest text-[8px] sm:text-[10px]">Cart</span>
            </div>
            <div className="w-8 sm:w-12 h-px bg-gray-200" />
            <div className={`flex items-center space-x-2 ${step === 'details' ? 'text-brand-blue' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[10px] sm:text-xs ${step === 'details' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>2</div>
              <span className="font-black uppercase tracking-widest text-[8px] sm:text-[10px]">Shipping</span>
            </div>
            <div className="w-8 sm:w-12 h-px bg-gray-200" />
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-brand-blue' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[10px] sm:text-xs ${step === 'payment' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>3</div>
              <span className="font-black uppercase tracking-widest text-[8px] sm:text-[10px]">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            {step === 'cart' && (
              <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-left-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Review Cart</h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={clearCart}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Cart
                    </button>
                    <span className="bg-brand-blue/10 text-brand-blue px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest">
                      {cart.length} Items
                    </span>
                  </div>
                </div>
                {cart.map((item) => (
                  <div key={item.product.id} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group hover:shadow-xl transition-all duration-500">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.product.images[0]?.src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left w-full">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1 sm:mb-2 line-clamp-1">{decodeHtml(item.product.name)}</h3>
                      <p className="text-brand-blue font-black text-base sm:text-lg mb-3 sm:mb-4">₦{parseFloat(item.product.price || '0').toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between sm:justify-start space-x-4">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-brand-blue transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 sm:w-10 text-center font-black text-xs sm:text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-brand-blue transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-2 sm:hidden"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="hidden sm:block text-gray-300 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                      <p className="text-xl font-black text-gray-900">
                        ₦{(parseFloat(item.product.price || '0') * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 'details' && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <button 
                  onClick={() => setStep('cart')}
                  className="flex items-center text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-6 sm:mb-8 hover:text-brand-blue transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to Cart
                </button>
                
                <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-8 lg:p-12 border border-gray-100 shadow-sm">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 sm:mb-10 tracking-tight flex items-center">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-brand-blue mr-3 sm:mr-4" />
                    Shipping Details
                  </h2>
                  
                  <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">First Name</label>
                      <input 
                        required
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Last Name</label>
                      <input 
                        required
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                      <input 
                        required
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Delivery Address</label>
                      <input 
                        required
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                        placeholder="House Number, Street Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">City</label>
                      <input 
                        required
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all"
                        placeholder="Ikeja"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">State</label>
                      <select 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 text-sm font-bold focus:bg-white focus:border-brand-blue focus:outline-none transition-all appearance-none"
                      >
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja (FCT)</option>
                        <option value="Rivers">Rivers (Port Harcourt)</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Oyo">Oyo (Ibadan)</option>
                        <option value="Kano">Kano</option>
                        <option value="Delta">Delta</option>
                        <option value="Edo">Edo</option>
                        <option value="Enugu">Enugu</option>
                        <option value="Anambra">Anambra</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Akwa Ibom">Akwa Ibom</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-50">
                      <h3 className="text-base sm:text-lg font-black text-gray-900 mb-4 sm:mb-6 uppercase tracking-widest">Shipping Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <button 
                          type="button"
                          onClick={() => setShippingMethod('standard')}
                          className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-center justify-between group ${shippingMethod === 'standard' ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                          <div>
                            <p className={`font-black text-xs sm:text-sm uppercase tracking-widest ${shippingMethod === 'standard' ? 'text-brand-blue' : 'text-gray-900'}`}>Standard Delivery</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">3-5 Business Days</p>
                          </div>
                          <p className="font-black text-sm sm:text-base text-brand-blue">₦2,500</p>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShippingMethod('express')}
                          className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex items-center justify-between group ${shippingMethod === 'express' ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                          <div>
                            <p className={`font-black text-xs sm:text-sm uppercase tracking-widest ${shippingMethod === 'express' ? 'text-brand-blue' : 'text-gray-900'}`}>Express Delivery</p>
                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">1-2 Business Days</p>
                          </div>
                          <p className="font-black text-sm sm:text-base text-brand-blue">₦5,000</p>
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="md:col-span-2 mt-6 sm:mt-10 w-full bg-brand-dark text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-blue transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center group"
                    >
                      <span>Review & Pay</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <button 
                  onClick={() => setStep('details')}
                  className="flex items-center text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-6 sm:mb-8 hover:text-brand-blue transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to Shipping
                </button>

                <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-8 lg:p-12 border border-gray-100 shadow-sm text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-blue/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-brand-blue" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight">Complete Payment</h2>
                  <p className="text-sm sm:text-base text-gray-500 font-medium mb-8 sm:mb-12 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                    Choose your preferred payment method to secure your premium items.
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-md mx-auto">
                    <button 
                      disabled={loading}
                      onClick={() => handleFinalPayment('paystack')}
                      className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-brand-blue bg-brand-blue/5 hover:bg-brand-blue/10 transition-all flex items-center justify-between group disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded border border-gray-100 flex items-center justify-center font-black text-[8px] sm:text-[10px] text-brand-blue italic">Paystack</div>
                        <span className="font-black text-xs sm:text-sm uppercase tracking-widest text-brand-blue">Pay with Card/Bank</span>
                      </div>
                      {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-brand-blue" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue group-hover:translate-x-1 transition-transform" />}
                    </button>
                    <button 
                      disabled={loading}
                      onClick={() => handleFinalPayment('flutterwave')}
                      className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-gray-100 hover:border-brand-blue hover:bg-brand-blue/5 transition-all flex items-center justify-between group disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-7 sm:w-12 sm:h-8 bg-white rounded border border-gray-100 flex items-center justify-center font-black text-[8px] sm:text-[10px] text-blue-600 italic">Flutterwave</div>
                        <span className="font-black text-xs sm:text-sm uppercase tracking-widest text-gray-900 group-hover:text-brand-blue transition-colors text-left">Multiple Channels</span>
                      </div>
                      {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-brand-blue" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>

                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-50 flex items-center justify-center space-x-4 sm:space-x-8 opacity-40 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4 sm:h-6 w-auto" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-3 sm:h-4 w-auto" alt="Visa" />
                    <img src="https://paystack.com/assets/img/v3/brand/paystack-logo.png" className="h-3 sm:h-4 w-auto" alt="Paystack" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="lg:sticky lg:top-32 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-3xl sm:rounded-[40px] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tight">Order Summary</h2>
                
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex justify-between text-gray-500 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-gray-900 text-sm">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest">
                    <span>Shipping ({shippingMethod})</span>
                    <span className="text-gray-900 text-sm">₦{shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 sm:pt-6 border-t border-gray-100 flex justify-between items-end">
                    <div>
                      <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Grand Total</p>
                      <p className="text-2xl sm:text-3xl font-black text-brand-blue tracking-tighter">₦{grandTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {step === 'cart' && (
                  <button 
                    onClick={handleProceedToDetails}
                    className="w-full bg-brand-dark text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-blue transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center group mb-4 sm:mb-6"
                  >
                    <span>Checkout Details</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {step === 'details' && (
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                    <p className="text-[8px] sm:text-[10px] font-bold text-brand-blue uppercase tracking-widest text-center">Fill the form to proceed</p>
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Secure SSL Encryption</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue" />
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Insured Delivery</span>
                  </div>
                </div>
              </div>

              {/* Support Box */}
              <div className="bg-brand-dark rounded-2xl sm:rounded-[32px] p-6 sm:p-8 text-white">
                <h4 className="font-black text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">Need Help?</h4>
                <p className="text-[10px] sm:text-xs text-gray-400 mb-4 sm:mb-6 leading-relaxed">Our support team is available 24/7 for any checkout assistance.</p>
                <button onClick={() => navigate('/contact')} className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-white/10 text-[8px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

