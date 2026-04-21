import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import Hakkimizda from './pages/Hakkimizda';
import TeslimatIade from './pages/TeslimatIade';
import GizlilikSozlesmesi from './pages/GizlilikSozlesmesi';
import MesafeliSatis from './pages/MesafeliSatis';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/hakkimizda" element={<Hakkimizda />} />
            <Route path="/teslimat-iade" element={<TeslimatIade />} />
            <Route path="/gizlilik" element={<GizlilikSozlesmesi />} />
            <Route path="/mesafeli-satis" element={<MesafeliSatis />} />
            <Route path="/odeme-basarili" element={<PaymentSuccess />} />
            <Route path="/odeme-basarisiz" element={<PaymentFail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </CartProvider>
    </div>
  );
}

export default App;
