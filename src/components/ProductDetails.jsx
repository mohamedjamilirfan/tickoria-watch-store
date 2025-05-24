import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiShoppingCart } from 'react-icons/fi';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: '',
    comment: '',
    rating: 5,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = collection(db, 'products');
      const productDocs = await getDocs(productRef);
      const productList = productDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const selectedProduct = productList.find((p) => p.id === id);
      setProduct(selectedProduct);
    };
  
    const fetchReviews = async () => {
      const reviewsRef = collection(db, `products/${id}/reviews`);
      const reviewsSnapshot = await getDocs(reviewsRef);
      const reviewsList = reviewsSnapshot.docs.map((doc) => doc.data());
      setReviews(reviewsList);
    };
  
    Promise.all([fetchProduct(), fetchReviews()]).then(() => {
      setLoading(false);
    });
  }, [id]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  

  const handleAddToCart = () => {
    if (!product?.stock) return;
    addToCart(product, selectedQuantity);
    setMessage('✅ Product added to cart!');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleQuantityChange = (e) => {
    let value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSelectedQuantity(value);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('You must be logged in to submit a review.');
      return;
    }

    const userId = auth.currentUser.uid;
    let userName = 'Anonymous';

    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        userName = userDocSnap.data().name;
      }

      const reviewData = {
        name: userName,
        comment: newReview.comment,
        rating: newReview.rating,
        userId,
        timestamp: new Date(),
      };

      const reviewsRef = collection(db, `products/${id}/reviews`);
      await addDoc(reviewsRef, reviewData);

      setReviews([...reviews, reviewData]);
      setNewReview({ comment: '', rating: 5 });
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <BsStarFill key={i} className="text-warning" />
      ) : (
        <BsStar key={i} className="text-secondary" />
      )
    );
  };

  if (!product) {
    return <h2 className="text-center text-white mt-5">Product not found</h2>;
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : 0;

  const roundedRating = Math.round(averageRating);

  return (
    <div
      className="container mt-5 pt-5 text-white"
      style={{ minHeight: '100vh' }}>
      <div className="row align-items-center mb-5">
        <div className="col-md-6 text-center">
          <img
            src={product.img}
            alt={product.name}
            className="img-fluid rounded shadow-lg"
            style={{ maxWidth: '80%' }}
          />
        </div>

        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p>{product.description}</p>
          <h4>
            ₹{product.price} {renderStars(roundedRating)} ({averageRating} / 5)
          </h4>
          <p
            className={
              product.stock ? 'text-success fw-bold' : 'text-danger fw-bold'
            }>
            {product.stock ? 'In Stock' : 'Out of Stock'}
          </p>

          <div className="mb-3">
            <label className="fw-bold">Quantity:</label>
            <input
              type="number"
              value={selectedQuantity}
              onChange={handleQuantityChange}
              className="form-control w-25"
              min="1"
              max={product.stock}
            />
          </div>

          <div className="d-flex flex-wrap gap-3 mt-3">
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={handleAddToCart}
              disabled={!product.stock}>
              <FiShoppingCart size={20} className="me-2" />
              {product.stock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/checkout')}
              disabled={!product.stock}>
              Buy Now 💳
            </button>

            <Link to="/" className="btn btn-outline-light">
              Back to Home
            </Link>
          </div>

          {message && (
            <div className="alert alert-success mt-3 text-dark" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        ) : (
          <ul className="list-group">
            {reviews.map((review, index) => (
              <li key={index} className="list-group-item">
                <strong>{review.name}</strong> {renderStars(review.rating)}
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="mt-4">
          <div className="row g-2">
            <div className="col-12">
              <textarea
                className="form-control"
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
                rows={3}></textarea>
            </div>

            <div className="col-md-6">
              <label className="form-label mt-2">Rating:</label>
              <select
                className="form-select"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    rating: parseInt(e.target.value),
                  })
                }>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 && 's'}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 d-flex align-items-end mt-2">
              <button type="submit" className="btn btn-warning w-100">
                Submit Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
