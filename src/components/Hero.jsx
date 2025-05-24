import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <div className="container-fluid bg-black text-white min-vh-100 d-flex align-items-center px-3 px-md-5">
      <div className="container">
        <div className="row align-items-center justify-content-center text-center text-md-start">
          {/* Left side - Watch Image */}
          <div className="col-md-6 d-flex justify-content-center justify-content-md-start">
            <motion.img
              src="/Watch1.png"
              alt="Luxury Watch"
              className="img-fluid w-75 watch-image"
              style={{ maxWidth: '500px', borderRadius: '10px' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />
          </div>

          {/* Right side - Text */}
          <div className="col-md-6 mt-4 mt-md-0">
            <motion.h3
              className="text-uppercase"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}>
              Combination of
            </motion.h3>

            <motion.h1
              className="fw-bold display-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}>
              SPORTY & ELEGANT
            </motion.h1>

            <motion.p
              className="lead"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}>
              With the best quality materials to produce luxurious and elegant
              products.
            </motion.p>

            <motion.button
              className="btn btn-light mt-3 px-4 py-2 fw-bold shadow-sm"
              style={{ transition: '0.3s' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#ddd')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}>
              See Product
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
