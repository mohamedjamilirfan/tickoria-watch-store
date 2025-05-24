import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(fetchedOrders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading order history...</p>;
  }

  return (
    <div className="container mt-4 text-white">
      <h2 className="text-center">Your Order History</h2>
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <ul className="list-group">
          {orders.map(order => (
            <li key={order.id} className="list-group-item bg-dark text-white">
              <div>
                <h5>Order ID: <span className="text-warning">{order.id}</span></h5>
                <p>Total Price: <span className="text-success">${order.total.toFixed(2)}</span></p>
                <p>Date: {new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>
                <Link to={`/order-confirmation/${order.id}`} className="btn btn-primary">View Details</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
