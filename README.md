# ⌚ Tickoria – Premium Watch E-Commerce Store

**Tickoria** is a full-featured, responsive e-commerce web application built with **React**, **Vite**, and **Firebase**, and deployed via **Vercel**. It provides a premium user experience for wristwatch enthusiasts, blending sleek design with powerful functionality.

![Tickoria Logo](./src/assets/Tickoria.png)

---

## 🚀 Key Features

- 🏠 **Home Page** – Hero section with call-to-action and highlights
- 🛍️ **Product Listings** – Clean grid view with 12 watch products
- 🔎 **Product Details** – Visual and descriptive information for each item
- 🛒 **Cart & Checkout** – Add to cart, view, and complete purchases
- 🔐 **User Authentication** – Sign Up / Sign In / Forgot Password (via Firebase)
- 👤 **User Profile** – View/edit profile, manage orders
- 🧑‍💼 **Admin Panel** – Add, update, and remove products
- ⌚ **Limited Edition** – Display of curated luxury watches
- 🌐 **Responsive Design** – Optimized across all screen sizes
- ⚡ **Vercel Hosting** – Blazing fast and globally deployed

---

## 🛠 Tech Stack

| Category           | Technology             |
| ------------------ | ---------------------- |
| **Frontend**       | React + Vite           |
| **Authentication** | Firebase Auth          |
| **Database**       | Firebase Firestore     |
| **Storage**        | Firebase Storage       |
| **Styling**        | CSS Modules, Bootstrap |
| **Deployment**     | Vercel                 |
| **Linting**        | ESLint                 |

---

## 📁 Project Structure

```
src/
├── assets/            # Images and logos
├── components/        # Navbar, Footer, Hero, ProductCards, etc.
├── data/              # Static product or country data
├── styles/            # CSS Modules for component styling
├── utils/             # Utility functions (e.g., localStorage utils)
├── firebaseConfig.js  # Firebase project config
├── App.jsx            # App structure and routes
└── main.jsx           # App entry point
```

---

## 🔧 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/mohamedjamilirfan/Tickoria-Watch-Store.git
cd Tickoria-Watch-Store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

Create `src/firebaseConfig.js` and add your Firebase project config:

```js
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

export default firebaseConfig;
```

Enable the following in your Firebase console:

- Authentication → Email/Password
- Firestore Database
- Firebase Storage (optional for product images)

### 4. Start the Development Server

```bash
npm run dev
```

---

## 📦 Deployment

Tickoria is ready for deployment via [Vercel](https://vercel.com).

### Deploy Using Vercel CLI

```bash
npm install -g vercel
vercel
```

Or deploy directly from GitHub using [vercel.com](https://vercel.com/dashboard).

---

## 🌍 Live Demo

👉 [Visit Tickoria Online](https://tickoria-watch-store.vercel.app)

---

## 🧑 Author

Developed by **Mohamed Jamil Irfan**  
GitHub: [@mohamedjamilirfan](https://github.com/mohamedjamilirfan)

---

## ⭐ Feedback & Contributions

If you find this project useful, feel free to ⭐ it on GitHub!  
Pull requests and issues are always welcome.
