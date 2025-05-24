import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/LimitedEdition.css'; // Make sure path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './LoadingSpinner'; // ✅ new import

const LimitedEdition = () => {
  const navigate = useNavigate();
  const [limitedWatches, setLimitedWatches] = useState([]);
    const [loading, setLoading] = useState(true); // <-- Loading state

  useEffect(() => {
    const fetchLimitedEditionProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'limitedEdition'));
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLimitedWatches(products);
        setLoading(false); // <-- Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching limited edition products:', error);
        setLoading(false);
      }
    };

    fetchLimitedEditionProducts();
  }, []);

  // Show spinner if loading
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="limited-edition-section">
    <div
      className="container text-center"
      style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
      }}>
      <h2 className="text-uppercase">Limited Edition</h2>

      <Carousel interval={3500} controls indicators>
        {limitedWatches.map((watch) => (
          <Carousel.Item key={watch.id}>
            <div className="row align-items-center">
              <div className="col-md-6" id='col-md-61'>
                <img
                  src={watch.img}
                  alt={watch.title}
                  className="img-fluid rounded shadow-lg"
                  // style={{ maxWidth: '400px' }}
                />
              </div>
              <div className="col-md-6 text-md-start" id='text-md-start1'>
                <h4 className="fw-bold">{watch.title}</h4>
                <p className="lead">{watch.desc}</p>
                <button
                  className="btn btn-dark px-4 py-2 fw-bold"
                  onClick={() => navigate(`/limited-edition/${watch.id}`)}>
                  Explore
                </button>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
    </section>
  );
};

export default LimitedEdition;
