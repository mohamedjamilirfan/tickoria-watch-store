import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import '../styles/Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminLimitedEdition = () => {
  const [limitedWatches, setLimitedWatches] = useState([]);
  const [newWatch, setNewWatch] = useState({
    title: '',
    desc: '',
    price: '',
    img: '',
    stock: 'In Stock', // Default value
  });
  const [editWatch, setEditWatch] = useState(null);

  useEffect(() => {
    const fetchLimitedEditionProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'limitedEdition'));
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLimitedWatches(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchLimitedEditionProducts();
  }, []);

  const handleImageUpload = async (e, setState) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile_pics');
    formData.append('cloud_name', 'dkl4itzbc');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dkl4itzbc/image/upload',
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setState((prev) => ({ ...prev, img: data.secure_url }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Try again.');
    }
  };

  const addProduct = async () => {
    if (!newWatch.title || !newWatch.desc || !newWatch.price || !newWatch.img) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'limitedEdition'), newWatch);
      setLimitedWatches([...limitedWatches, { id: docRef.id, ...newWatch }]);
      setNewWatch({
        title: '',
        desc: '',
        price: '',
        img: '',
        stock: 'In Stock',
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async () => {
    if (!editWatch) return;
    try {
      const productRef = doc(db, 'limitedEdition', editWatch.id);
      await updateDoc(productRef, editWatch);
      setLimitedWatches((prev) =>
        prev.map((item) => (item.id === editWatch.id ? editWatch : item))
      );
      setEditWatch(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'limitedEdition', id));
      setLimitedWatches(limitedWatches.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <>
      <div className="admin-limited-container">
        <h2>Manage Limited Edition Products</h2>

        {/* Product Input Form */}
        <div className="limited-form">
          <h4>{editWatch ? 'Edit Product' : 'Add New Product'}</h4>
          <input
            type="text"
            placeholder="Product Name"
            value={editWatch?.title || newWatch.title}
            onChange={(e) =>
              editWatch
                ? setEditWatch({ ...editWatch, title: e.target.value })
                : setNewWatch({ ...newWatch, title: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={editWatch?.price || newWatch.price}
            onChange={(e) =>
              editWatch
                ? setEditWatch({ ...editWatch, price: e.target.value })
                : setNewWatch({ ...newWatch, price: e.target.value })
            }
          />

          <textarea
            id='textarea21'
            type="text"
            placeholder="Product Description"
            value={editWatch?.desc || newWatch.desc}
            onChange={(e) =>
              editWatch
                ? setEditWatch({ ...editWatch, desc: e.target.value })
                : setNewWatch({ ...newWatch, desc: e.target.value })
            }
          />
          <select
            id='textarea22'
            value={editWatch?.stock || newWatch.stock}
            onChange={(e) =>
              editWatch
                ? setEditWatch({ ...editWatch, stock: e.target.value })
                : setNewWatch({ ...newWatch, stock: e.target.value })
            }>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <input
            type="file"
            className="file-input my-2"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e, editWatch ? setEditWatch : setNewWatch)
            }
          />
          {editWatch?.img || newWatch.img ? (
            <img
              src={editWatch?.img || newWatch.img}
              alt="Preview"
              width="100"
            />
          ) : null}
          {editWatch ? (
            <>
              <button className="btn btn-primary mt-3" onClick={updateProduct}>Save Changes</button>
              <button className="btn btn-secondary mt-3" onClick={() => setEditWatch(null)}>Cancel</button>
            </>
          ) : (
            <button className='btn btn-primary mt-3' onClick={addProduct}>Add Product</button>
          )}
        </div>
      </div>

      {/* Product List Table */}
      <h3>Product List</h3>
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
          {limitedWatches.map((watch, index) => (
            <tr key={watch.id}>
              <td>{index + 1}</td>
              <td>
                <img src={watch.img} alt={watch.title} width="65" />
              </td>
              <td>{watch.title}</td>
              <td>{watch.price}</td>
              <td>{watch.desc}</td>
              <td>{watch.stock}</td> {/* Display stock status */}
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => setEditWatch(watch)}>
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => deleteProduct(watch.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminLimitedEdition;
