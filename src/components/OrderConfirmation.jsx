import React, { useEffect, useState } from 'react';
import '../styles/OrderConfirm.css';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // ✅ new import

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Retrieve order details from localStorage (or fetch from Firestore later)
    const storedOrder = JSON.parse(localStorage.getItem('orderDetails'));
    if (storedOrder) {
      setOrderDetails(storedOrder);
    } else {
      navigate('/'); // Redirect to home if no order details found
    }
  }, [navigate]);

  if (!orderDetails) {
    return <LoadingSpinner />;
  }

  // Calculate estimated delivery date (5-7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(
    deliveryDate.getDate() + Math.floor(Math.random() * (7 - 5 + 1)) + 5
  );

  return (
    <div className="container mt-4 text-white">
      <h2 className="text-center" id="h21">
        Order Confirmation
      </h2>
      <p className="text-center">
        Thank you for your purchase! Your order has been placed successfully.
      </p>

      <h4>
        Order ID: <span className="text-warning">{orderId}</span>
      </h4>

      <h4 className="mt-4">Ordered Items</h4>
      <ul className="list-group">
        {orderDetails.items.map((item) => (
          <li
            key={item.id}
            className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
            <div>
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: '50px',
                  marginRight: '10px',
                  borderRadius: '5px',
                }}
              />
              {item.name} - {item.quantity} x ${item.price.toFixed(2)}
            </div>
            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
      </ul>

      <h4 className="mt-3">
        Total Price:{' '}
        <span className="text-success">${orderDetails.total.toFixed(2)}</span>
      </h4>

      <h4 className="mt-4">Shipping Details</h4>
      <p>
        <strong>Name:</strong> {orderDetails.shipping.name}
      </p>
      <p>
        <strong>Address:</strong> {orderDetails.shipping.address}
      </p>
      <p>
        <strong>Phone:</strong> {orderDetails.shipping.phone}
      </p>

      <h4 className="mt-4">Estimated Delivery:</h4>
      <p className="text-info">{deliveryDate.toDateString()}</p>

      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;
