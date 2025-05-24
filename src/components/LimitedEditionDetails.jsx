import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { db } from '../firebaseConfig';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from './LoadingSpinner'; // ✅ new import
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

const LimitedEditionDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [newReview, setNewReview] = useState({
    name: '',
    comment: '',
    rating: 5,
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoadingProduct(true); // ⏳ show loading
        const docRef = doc(db, 'limitedEdition', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such product!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoadingProduct(false); // ✅ hide loading
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const reviewsRef = collection(db, 'limitedEdition', id, 'reviews');
    setLoadingReviews(true); // ⏳
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
      setLoadingReviews(false); // ✅
    });

    return () => unsubscribe();
  }, [id]);

  if (!product || loadingProduct) {
    return <LoadingSpinner />; // ⏳ show spinner if loading
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert('You must be logged in to submit a review.');
      return;
    }

    const userId = auth.currentUser.uid;

    try {
      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      let userName = 'Anonymous'; // Default name if not found

      if (userDocSnap.exists()) {
        userName = userDocSnap.data().name; // Get the user's name from Firestore
      }

      const reviewData = {
        name: userName, // Use the profile name from Firestore
        comment: newReview.comment,
        rating: newReview.rating,
        userId: userId,
        timestamp: new Date(),
      };

      const reviewsRef = collection(db, `limitedEdition/${id}/reviews`);
      await addDoc(reviewsRef, reviewData);

      setReviews([...reviews, reviewData]); // Update UI
      setNewReview({ comment: '', rating: 5 });
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <BsStarFill key={i} className="text-warning me-1" />
      ) : (
        <BsStar key={i} className="text-warning me-1" />
      )
    );
  };

  if (!product) {
    return <h2 className="text-center text-white mt-5">Product not found</h2>;
  }

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 'No ratings yet';

  return (
    <div className="container pt-5 my-5 text-white" style={{ height: 'auto' }}>
      <div className="row">
        <div className="col-md-5 text-center">
          <img
            src={product.img}
            alt={product.title}
            className="img-fluid rounded shadow-lg"
          />
        </div>
        <div className="col-md-7">
          <h2 className="fw-bold">{product.title}</h2>
          <p className="lead">{product.desc}</p>
          <h3 className="text-warning">
            ${product.price}{' '}
            <span className="text-light">
              ({averageRating} / 5 ⭐ from {reviews.length} reviews)
            </span>
          </h3>
          <p className="text-success fw-bold">In Stock</p>
          <div>
            <label className="fw-bold">Quantity:</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
              className="form-control w-25 my-2"
            />
          </div>
          <div className="mt-3 d-flex flex-wrap gap-3">
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={() => addToCart(product, parseInt(quantity, 10))}>
              <FiShoppingCart size={20} className="me-2" /> Add to Cart
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/checkout')}>
              💳 Buy Now
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <hr className="my-4 text-light" />

      <h4 className="fw-bold">Customer Reviews</h4>
      {loadingReviews ? (
        <LoadingSpinner />
      ) : (
        <>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="bg-light text-dark p-3 rounded my-2">
                <strong>{review.name} </strong> {renderStars(review.rating)}
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-muted">
              No reviews yet. Be the first to review!
            </p>
          )}
        </>
      )}

      <form onSubmit={handleReviewSubmit} className="mt-4">
        <textarea
          placeholder="Your Review"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          className="form-control mb-2"
          required
        />
        <label className="fw-bold">Rating:</label>
        <div className="d-flex mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setNewReview({ ...newReview, rating: star })}
              style={{ cursor: 'pointer' }}>
              {star <= newReview.rating ? (
                <BsStarFill className="text-warning fs-4 me-1" />
              ) : (
                <BsStar className="text-warning fs-4 me-1" />
              )}
            </span>
          ))}
        </div>
        <button type="submit" className="btn btn-warning">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default LimitedEditionDetails;
