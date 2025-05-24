import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ProductCards.css'; // Make sure path is correct
import LoadingSpinner from './LoadingSpinner'; // ✅ new import

const ProductCards = ({ addToCart }) => {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // <-- Loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false); // <-- Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show spinner if loading
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-5" style={{ marginBottom: '3rem' }}>
      <h2 className="text-center text-uppercase mb-4">Featured Products</h2>
      <div className="row" style={{ rowGap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} className="col-md-6 col-lg-4">
            <div
              className="card bg-dark text-white border-0 shadow-sm text-center"
              style={{ alignItems: 'center' }}>
              <img
                src={product.img}
                alt={product.name}
                className="card-img-top"
                style={{ height: '310px', width: '300px', paddingTop: '10px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">${product.price}</p>
                <button
                  className="btn btn-success me-2"
                  onClick={() => addToCart(product)}>
                  Add to Cart 🛒
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="btn btn-outline-light">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCards;
