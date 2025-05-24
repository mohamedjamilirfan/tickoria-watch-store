import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../styles/Navbar.css'; // Make sure path is correct
import Tickoria from '../assets/Tickoria.png';

const ADMIN_EMAIL = 'mohamedjamilirfan14@gmail.com'; // Change this to your actual admin email

const Navbar = ({ cartItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const signIn1 = location.pathname === '/signin';

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.getElementById('navbarNav');

    const handleToggle = () => {
      collapse.classList.toggle('open');
    };

    toggler.addEventListener('click', handleToggle);

    return () => {
      toggler.removeEventListener('click', handleToggle);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => setIsOpen(false));
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener('click', () => setIsOpen(false));
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    if (location.pathname === '/') {
      const sections = [
        { id: 'hero', offset: 0 },
        { id: 'products', offset: 0 },
        { id: 'limited-edition', offset: 0 },
      ];

      console.log(sections);

      const updateOffsets = () => {
        sections.forEach((section) => {
          const element = document.getElementById(section.id);
          if (element) {
            section.offset = element.offsetTop - 150;
          }
        });
      };

      const handleScroll = () => {
        const sectionIds = ['hero', 'products', 'limited-edition'];
        let currentSection = 'hero';

        sectionIds.forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = id;
            }
          }
        });

        setActiveSection(currentSection); // or however you're updating state
      };

      updateOffsets();
      window.addEventListener('resize', updateOffsets);
      window.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => {
        window.removeEventListener('resize', updateOffsets);
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // Handle route-based active section
      const path = location.pathname;
      if (path === '/products') {
        setActiveSection('products');
      } else if (path === '/limited-edition') {
        setActiveSection('limited-edition');
      } else if (path === '/about') {
        setActiveSection('about');
      } else if (path === '/') {
        setActiveSection('hero');
      } else {
        setActiveSection('');
      }
    }
  }, [location.pathname]);

  const handleNavigateAndScroll = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const section = document.getElementById(id);
      if (section) {
        const navbarHeight =
          document.querySelector('.navbar')?.offsetHeight || 70;
        const offsetTop = section.offsetTop - navbarHeight - 10;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        setActiveSection(id);
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top shadow">
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          onClick={() => handleNavigateAndScroll('hero')}>
          <img src={Tickoria} alt="" id="tickoria" />
        </Link>
        {/* Toggle and Close Buttons */}
        <button
          className={`navbar-toggler d-lg-none ${isOpen ? 'd-none' : ''}`}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {isOpen && (
          <button
            className="btn-close btn-close-white d-lg-none position-absolute top-0 end-0 m-3"
            style={{ zIndex: 1047 }}
            onClick={() => setIsOpen(false)}
            aria-label="Close"></button>
        )}
        <div
          className={`navbar-collapse offcanvas-collapse ${
            isOpen ? 'open' : ''
          } d-lg-flex justify-content-lg-between`}
          id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${
                  activeSection === 'hero' ? 'active' : ''
                }`}
                onClick={() => handleNavigateAndScroll('hero')}>
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${
                  activeSection === 'products' ? 'active' : ''
                }`}
                onClick={() => handleNavigateAndScroll('products')}>
                Our Products
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link ${
                  activeSection === 'limited-edition' ? 'active' : ''
                }`}
                onClick={() => handleNavigateAndScroll('limited-edition')}>
                Limited Edition
              </button>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  activeSection === 'about' ? 'active' : ''
                }`}
                to="/about">
                About Us
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <Link
              to="/cart"
              className={`btn ${
                location.pathname === '/cart'
                  ? 'btn-light text-dark'
                  : 'btn-outline-light'
              } me-2`}>
              <FiShoppingCart size={20} /> Cart ({cartItems.length})
            </Link>

            {user ? (
              <Link
                to="/profile"
                className={`btn ${
                  location.pathname === '/profile'
                    ? 'btn-light text-dark'
                    : 'btn-outline-light'
                } me-2`}>
                <FiUser size={20} />
              </Link>
            ) : signIn1 ? (
              <Link
                to="/signin"
                className={`btn ${
                  location.pathname === '/signin'
                    ? 'btn-light text-dark'
                    : 'btn-outline-light'
                } me-2`}>
                Sign In
              </Link>
            ) : (
              <Link
                to="/signup"
                className={`btn ${
                  location.pathname === '/signup'
                    ? 'btn-light text-dark'
                    : 'btn-outline-light'
                } me-2`}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
