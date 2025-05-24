import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { auth } from './data/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import Home from './components/Home';
import Footer from './components/Footer';
import AddToCart from './components/AddToCart';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import LimitedEditionDetails from './components/LimitedEditionDetails';
import ResetPassword from './components/ResetPassword';
import NewPassword from './components/NewPassword';
import Admin from './components/Admin';
import AdminLimitedEdition from './components/AdminLimitedEdition';
import AdminLogin from './components/AdminLogin';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import AboutUs from './components/AboutUs';
import LoadingSpinner from './components/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Once auth is checked, remove loading
    });
    return () => unsubscribe();
  }, []);

  // if (loading) {
  //   return <WatchLoader />; // check if spinner shows
  // }

  // Inside App() component:
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );

    let updatedCart;
    if (existingItemIndex !== -1) {
      // If item already exists, update quantity
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      // Else, add new item
      updatedCart = [...cartItems, { ...product, quantity }];
    }

    setCartItems(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar cartItems={cartItems} />
      <main className="flex-fill">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route
            path="/cart"
            element={
              <AddToCart cartItems={cartItems} setCartItems={setCartItems} />
            }
          />
          <Route
            path="/product/:id"
            element={<ProductDetails addToCart={addToCart} />}
          />
          <Route
            path="/limited-edition/:id"
            element={<LimitedEditionDetails addToCart={addToCart} />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/signin" element={user ? <Profile /> : <SignIn />} />
          <Route path="/signup" element={user ? <Profile /> : <SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/profile" element={user ? <Profile /> : <SignIn />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-limited" element={<AdminLimitedEdition />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
