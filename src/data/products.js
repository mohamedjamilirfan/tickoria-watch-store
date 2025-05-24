import Watch1 from '../assets/watch1.png';
import Watch2 from '../assets/watch2.png';
import Watch3 from '../assets/watch3.png';

const products = [
  {
    id: 1,
    name: 'Classic Watch',
    price: '$199',
    img: Watch1, // ✅ Use imported image
    description: 'Timeless elegance with a durable design.',
    rating: 4.5,
    stock: true,
    variants: ['Leather Strap', 'Metal Strap', 'Rubber Strap'],
  },
  {
    id: 2,
    name: 'Modern Watch',
    price: '$249',
    img: Watch2, // ✅ Use imported image
    description: 'Sleek design with modern functionality.',
    rating: 4.0,
    stock: false,
    variants: ['Black Edition', 'Silver Edition'],
  },
  {
    id: 3,
    name: 'Luxury Watch',
    price: '$399',
    img: Watch3, // ✅ Use imported image
    description: 'Premium craftsmanship with luxury features.',
    rating: 5,
    stock: true,
    variants: ['Gold Finish', 'Platinum Finish'],
  },
];

export default products;
