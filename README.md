
# ⌚ Tickoria – Premium Watch E-Commerce Store

**Tickoria** is a full-featured, responsive e-commerce web application built with **React**, **Vite**, and **Firebase**, deployed seamlessly via **Vercel**. It offers a premium shopping experience for wristwatch enthusiasts, combining elegant design with powerful functionality.

![Tickoria Logo](./src/assets/Tickoria.png)

---

## 🚀 Key Features

- 🏠 **Home Page** – Eye-catching hero section with featured products
- 🛍️ **Product Listings** – Browse watches with clean grid layout and filters
- 🔎 **Product Details** – View high-resolution images and descriptions
- 🛒 **Cart & Checkout** – Seamless cart and purchase flow
- 🔐 **Authentication** – Sign Up / Sign In / Forgot Password (Firebase Auth)
- 👤 **User Profile** – Manage personal info and view order history
- 🧑‍💼 **Admin Panel** – Add, edit, and remove products
- ⌚ **Limited Edition** – Curated collection of exclusive watches
- 🌐 **Responsive Design** – Fully optimized for all screen sizes
- ⚡ **Deployed on Vercel** – Fast, reliable global hosting

---

## 🛠 Tech Stack

| Category         | Technology            |
|------------------|------------------------|
| **Frontend**     | React + Vite           |
| **Auth**         | Firebase Authentication|
| **Database**     | Firebase Firestore     |
| **Storage**      | Firebase Storage       |
| **Styling**      | CSS Modules + Bootstrap|
| **Deployment**   | Vercel                 |
| **Linting**      | ESLint                 |

---

## 📁 Folder Structure

```
src/
├── assets/         # Watch images, logo, icons
├── components/     # Navbar, Hero, ProductCards, Footer, etc.
├── data/           # Static JSON/product data
├── styles/         # Component-specific CSS modules
├── utils/          # Helpers (e.g., localStorage)
├── firebaseConfig.js  # Firebase project config
├── App.jsx         # Main application logic
└── main.jsx        # React entry point
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tickoria.git
cd tickoria
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

In `src/firebaseConfig.js`, add your Firebase config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default firebaseConfig;
```

Enable:
- Email/Password Authentication
- Firestore Database
- (Optional) Firebase Hosting

### 4. Run Locally

```bash
npm run dev
```

---

## 📦 Deployment

Tickoria is optimized for **Vercel**.

### Deploy with CLI:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo via [vercel.com](https://vercel.com/dashboard).

---

## 🧑 Author

Developed by **[Mohamed Jamil Irfan]**  
GitHub: [mohamedjamilirfan](https://github.com/mohamedjamilirfan/)

---

## ⭐ Feedback & Contributions

If you enjoyed using this project, please give it a ⭐ on GitHub!  
Pull Requests and suggestions are welcome and appreciated.

---

## 📥 Download Project

To download this project as a ZIP file, [click here](https://github.com/your-username/tickoria/archive/refs/heads/main.zip).
