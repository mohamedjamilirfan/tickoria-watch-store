import React from 'react';
import '../styles/AboutUs.css';
import { Container, Row, Col } from 'react-bootstrap';
import Gear from '../assets/gear.svg';
import { useNavigate } from 'react-router-dom';
import Tickoria from '../../public/Watch1.png'; // not used in this code but imported

const AboutUs = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/', { state: { scrollTo: 'products' } });
  };

  return (
    <div className="about-modern py-5">
      <Container>
        {/* Page Title */}
        <h1 className="text-center display-5 mb-5" id="title">
          Timeless Craft, Modern Soul
        </h1>

        {/* Brand Story */}
        <Row className="mb-5 align-items-center">
          <Col md={6} id="aboutimg">
            <img
              src={Tickoria}
              alt="Watch"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6} id="desc">
            <p className="lead">
              At <strong>Tickoria</strong>, we blend heritage watchmaking with
              futuristic technology. Every watch we craft tells a story of
              precision, elegance, and individuality.
            </p>
            <p>
              Whether it’s a classic piece or a limited edition, our timepieces
              reflect your character – bold, refined, and timeless.
            </p>
          </Col>
        </Row>

        <hr />

        {/* Why Tickoria - Features */}
        <h3 className="text-center mb-4 mt-5">Why Choose Tickoria?</h3>
        <Row className="text-center mb-5">
          <Col md={4}>
            <i className="bi bi-watch fs-1 mb-3"></i>
            <h5>Swiss Precision</h5>
            <p>World-class accuracy and craftsmanship.</p>
          </Col>
          <Col md={4}>
            <i className="bi bi-gem fs-1 mb-3"></i>
            <h5>Luxury Redefined</h5>
            <p>Elegant designs for every occasion.</p>
          </Col>
          <Col md={4}>
            <i className="bi bi-lightning fs-1 mb-3"></i>
            <h5>Smart Innovation</h5>
            <p>Modern features without compromising class.</p>
          </Col>
        </Row>

        <hr />

        {/* Gear Animation */}
        <div className="text-center my-5">
          <h4 className="mb-4">Crafted with Precision</h4>
          <img
            src={Gear}
            alt="Gear Animation"
            className="gear-animation my-3"
          />
          <p>Every movement, engineered to perfection.</p>
        </div>

        <hr />

        {/* Our Story */}
        <section className="my-5 px-3">
          <h3 className="text-center mb-4">Our Story</h3>
          <p
            className="mx-auto"
            style={{ maxWidth: '800px', textAlign: 'justify' }}>
            Founded with a passion for horology, we blend timeless aesthetics
            with cutting-edge technology. Every watch we offer is a testament to
            craftsmanship, precision, and legacy.
          </p>
        </section>

        <hr />

        {/* Additional Highlights */}
        <section className="my-5">
          <h3 className="text-center">What Sets Us Apart</h3>
          <Row className="text-center mt-4">
            <Col md={4}>
              <i className="bi bi-shield-check fs-1 text-primary"></i>
              <h5>Premium Quality</h5>
              <p>Only the finest materials and movements.</p>
            </Col>
            <Col md={4}>
              <i className="bi bi-star fs-1 text-warning"></i>
              <h5>Stylish Designs</h5>
              <p>Modern, minimal, and timeless aesthetics.</p>
            </Col>
            <Col md={4}>
              <i className="bi bi-truck fs-1 text-success"></i>
              <h5>Fast Delivery</h5>
              <p>Reliable shipping with secure packaging.</p>
            </Col>
          </Row>
        </section>

        <hr />

        {/* Call to Action */}
        <div className="text-center my-5">
          <h4>Ready to own timeless style?</h4>
          <button onClick={handleExploreClick} className="btn btn-dark mt-3">
            Explore Our Watches
          </button>
        </div>

        <hr />

        {/* Final CTA */}
        <div className="text-center mt-5">
          <h4>Join our journey of time.</h4>
          <p>Explore exclusive collections built for the bold and timeless.</p>
          <a href="/" className="btn btn-outline-light mt-2">
            Back to Home
          </a>
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;
