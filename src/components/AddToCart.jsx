import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiTrash2 } from 'react-icons/fi';

const AddToCart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Ensure valid objects and convert price & quantity to numbers
    const formattedCart = storedCart
      .filter((item) => item && typeof item === 'object' && item.price != null) // Ensure item is not null
      .map((item) => ({
        ...item,
        price: Number(item.price) || 0, // Convert price to number
        quantity: Number(item.quantity) || 1, // Convert quantity to number
      }));

    setCartItems(formattedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Number(newQuantity)) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <div className="container mt-5 pt-5 text-white">
      <h2 className="text-center mb-3">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: '50px', borderRadius: '5px' }}
                    />
                  </td>
                  <td>{item.name || item.title}</td>
                  <td>
                    $
                    {typeof item.price === 'number'
                      ? item.price.toFixed(2)
                      : '0.00'}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="form-control w-50"
                    />
                  </td>
                  <td>
                    $
                    {typeof item.price === 'number'
                      ? (item.price * item.quantity).toFixed(2)
                      : '0.00'}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(item.id)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="text-end">Total: ${totalPrice.toFixed(2)}</h4>
          <div className="d-flex justify-content-between">
            <button className="btn btn-danger" onClick={handleClearCart}>
              Clear Cart
            </button>
            <button
              className="btn btn-success"
              onClick={() => navigate('/checkout')}>
              Proceed to Buy
            </button>
          </div>
        </div>
      )}
      <div className="text-center mt-3">
        <Link to="/" className="btn btn-outline-light">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default AddToCart;
