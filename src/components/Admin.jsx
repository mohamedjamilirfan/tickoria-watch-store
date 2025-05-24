import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';
import AdminLimitedEdition from './AdminLimitedEdition';
import 'bootstrap/dist/css/bootstrap.min.css';

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    stock: true,
    img: null,
  });
  const [uploading, setUploading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null); // Track product being edited

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
    }

    // Fetch Products from Firestore
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        setProducts(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [navigate]);

  // Logout Admin
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('isAdmin'); // Remove admin session
      navigate('/admin-login'); // Redirect to admin login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Upload Image to Cloudinary
  const uploadImage = async (file, callback) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile_pics');
    formData.append('cloud_name', 'dkl4itzbc');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dkl4itzbc/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      callback(data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
    }
  };

  // Add Product to Firestore
  const addProduct = async () => {
    try {
      const user = auth.currentUser;
      if (!user || user.email !== 'mohamedjamilirfan14@gmail.com') {
        alert('You do not have permission to add products.');
        return;
      }

      if (!productData.name || !productData.price || !productData.img) {
        alert('Please fill all fields before adding a product.');
        return;
      }

      const newProduct = {
        name: productData.name,
        price: productData.price,
        description: productData.description,
        stock: productData.stock,
        img: productData.img,
      };

      const docRef = await addDoc(collection(db, 'products'), newProduct);
      setProducts([...products, { id: docRef.id, ...newProduct }]);

      resetForm();
    } catch (error) {
      alert('Failed to add product: ' + error.message);
    }
  };

  // Start Editing a Product
  const startEdit = (product) => {
    setEditingProductId(product.id);
    setProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      img: product.img, // Keep existing image
    });
  };

  // Save Edited Product
  const saveEdit = async () => {
    if (!editingProductId) return;

    try {
      const updatedProduct = {
        name: productData.name || '',
        price: productData.price || '',
        description: productData.description || '',
        stock: productData.stock ?? true, // Ensure stock is always boolean
        img: productData.img || '',
      };

      await updateDoc(doc(db, 'products', editingProductId), updatedProduct);
      setProducts(
        products.map((product) =>
          product.id === editingProductId
            ? { id: product.id, ...updatedProduct }
            : product
        )
      );

      resetForm();
    } catch (error) {
      alert('Failed to update product: ' + error.message);
    }
  };

  // Delete Product from Firestore
  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Reset Form After Adding or Editing
  const resetForm = () => {
    setProductData({
      name: '',
      price: '',
      description: '',
      stock: true,
      img: null,
    });
    setEditingProductId(null);
  };

  return (
    <>
      <div className="container container1">
        <h2 className="text-center text-uppercase margin21">Admin Panel</h2>

        <div className="admin-limited-container">
        <h2>Manage Limited Edition Products</h2>

          {/* ✅ Add/Edit Product Form */}
        <div className="limited-form">
          <h4>{editingProductId ? 'Edit Product' : 'Add New Product'}</h4>
          <input
            type="text"
            placeholder="Product Name"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
          />
          <textarea
            id='textarea21'
            placeholder="Product Description"
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
          />
          <select
            id='textarea22'
            value={productData.stock}
            onChange={(e) =>
              setProductData({
                ...productData,
                stock: e.target.value === 'true',
              })
            }>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
          <input
            type="file"
            className="file-input my-2"
            accept="image/*"
            onChange={(e) =>
              uploadImage(e.target.files[0], (url) =>
                setProductData({ ...productData, img: url })
              )
            }
          />
          {uploading && <p>Uploading Image...</p>}
          {productData.img && (
            <img src={productData.img} alt="Preview" width="100" />
          )}

          <button
            className="btn btn-primary mt-3"
            onClick={editingProductId ? saveEdit : addProduct}
            disabled={uploading}>
            {uploading
              ? 'Uploading...'
              : editingProductId
              ? 'Save Changes'
              : 'Add Product'}
          </button>
          {editingProductId && (
            <button className="btn btn-secondary mt-3" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
        </div>

        {/* ✅ Product List */}
        <table className="table table-dark table-striped mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>
                  <img src={product.img} alt={product.title} width="60" />
                </td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td>{product.stock ? 'In Stock' : 'Out of Stock'}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => startEdit(product)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDelete(product.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <hr />
        <br />
        <div className="admin-section">
          <AdminLimitedEdition />
        </div>
        <br />
        <br />
        {/* ✅ Logout Button */}
        <div className="text-center mt-4">
          <button className="btn btn-danger" style={{width: '100%'}} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Admin;
