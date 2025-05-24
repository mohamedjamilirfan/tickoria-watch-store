import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../data/firebase';
import '../styles/Checkout.css';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCart);

    const total = storedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, []);

  const handleInputChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingDetails.name ||
      !shippingDetails.address ||
      !shippingDetails.phone
    ) {
      alert('Please fill in all the shipping details.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to place an order.');
      return;
    }

    try {
      const orderData = {
        userId: user.uid,
        items: cartItems,
        total: totalPrice,
        shipping: shippingDetails,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log('✅ Order placed successfully:', docRef.id); // Debugging log

      localStorage.setItem('orderDetails', JSON.stringify(orderData));
      localStorage.removeItem('cartItems');
      setCartItems([]);

      navigate(`/order-confirmation/${docRef.id}`);
    } catch (error) {
      console.error('❌ Error placing order:', error); // Log error details
      alert(`Something went wrong: ${error.message}`); // Show exact error message
    }
  };

  return (
    <div className="container mt-4 text-white">
      <h2 className="text-center" id="h2">
        Checkout
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <h4>Order Summary</h4>
          <ul className="list-group">
            {cartItems.map((item) => (
              <li key={item.id} className="list-group-item bg-dark text-white">
                {item.name} - {item.quantity} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>

          <h4 className="mt-3">Total: ${totalPrice.toFixed(2)}</h4>

          <h4 className="mt-4">Shipping Details</h4>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={shippingDetails.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mt-2">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={shippingDetails.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mt-2">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={shippingDetails.phone}
              onChange={handleInputChange}
            />
          </div>

          <button
            className="btn btn-success mt-3"
            onClick={handlePlaceOrder}
            disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
