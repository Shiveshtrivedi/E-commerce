import {
  IAuthState,
  IOrder,
  IProduct,
  IProductState,
  IReview,
  IWishListItem,
} from '../../utils/type/types';

export const initialAuthState: IAuthState = {
  isAuthenticated: true,
  user: {
    id: '1',
    name: 'shivesh',
    email: 'shivesh@gmail.com',
    password: 'Shivesh@123',
    idAdmin: false,
  },
  token: '1',
  error: '',
  isAdmin: false,
  userEmail: 'shivesh@gmail.com',
};

export const initialAuthStateForAdmin: IAuthState = {
  isAuthenticated: true,
  user: {
    id: '1',
    name: 'shivesh',
    email: 'shivesh@intimetec.com',
    password: 'Shivesh@123',
    idAdmin: true,
  },
  token: '1',
  error: '',
  isAdmin: true,
  userEmail: 'shivesh@intimetec.com',
};

export const invalidLoginCredentials = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};

export const mockUser = {
  id: '1',
  name: 'Shivesh',
  email: 'shivesh@gmail.com',
  password: 'Shivesh@123',
  isAuthenticated: true,
  token: '1',
  idAdmin: false,
};

export const mockAdminUser = {
  id: '2',
  name: 'Shivesh',
  email: 'shivesh@intimetec.com',
  password: 'Shivesh@123',
  isAuthenticated: true,
  token: '2',
  idAdmin: true,
};

export const mockSignupUser = {
  id: '3',
  name: 'hardik',
  email: 'hardik@gmail.com',
  password: 'hardik@123',
  isAuthenticated: true,
  token: '3',
  idAdmin: false,
};

export const mockSignupAdminUser = {
  id: '4',
  name: 'hardik',
  email: 'hardik@intimetec.com',
  password: 'hardik@123',
  isAuthenticated: true,
  token: '4',
  idAdmin: true,
};

export const initialCartState = {
  items: [
    {
      id: 1,
      name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      quantity: 1,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
  ],
  totalAmount: 109.95,
  userId: '1',
  totalItems: 1,
};

export const newCartItem = {
  id: 1,
  name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
  price: 109.95,
  quantity: 1,
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
};

export const edgeCaseProduct = {
  id: '999',
  title: 'Edge Case Product',
  price: 999.99,
  image: 'https://example.com/edge-case.jpg',
  description: 'A product with edge case attributes.',
  category: 'misc',
};

export const mockCartItem = [
  {
    id: 1,
    name: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    quantity: 2,
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  },
];

export const initialProductState: IProductState = {
  products: [
    {
      id: '1',
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      category: 'men clothing',
    },
  ],
  adminProductsHistory: [
    {
      id: '1',
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      category: 'men clothing',
    },
  ],
  filterProducts: [
    {
      id: '1',
      title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price: 109.95,
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      description:
        'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
      category: 'men clothing',
    },
  ],
  status: 'idle',
  error: '',
  id: '1',
};
export const mockProduct = {
  id: '1',
  title: 'New Product',
  price: 59.99,
  image: 'https://example.com/image.jpg',
  description: 'A new product description',
  category: 'men clothing',
};
export const newProduct = {
  id: '2',
  title: 'New Product',
  price: 59.99,
  image: 'https://example.com/image.jpg',
  description: 'A new product description',
  category: 'men clothing',
};

export const mockReviews: IReview[] = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    rating: 5,
    comment: 'Great product!',
    timestamp: '2021-09-01T00:00:00.000Z',
  },
  {
    id: '2',
    productId: '1',
    userId: '1',
    rating: 4,
    comment: 'Very good quality.',
    timestamp: '2021-09-02T00:00:00.000Z',
  },
];
export const mockReview: IReview = {
  id: '1',
  productId: '1',
  userId: '1',
  rating: 5,
  comment: 'Great product!',
  timestamp: '2021-09-01T00:00:00.000Z',
};

export const mockWishListItem: IWishListItem = {
  id: 1,
  name: 'Product 1',
  price: 19.99,
  image: 'https://example.com/product1.jpg',
};

export const mockOrder: IOrder = {
  id: 'order_001',
  userId: 'user_123',
  items: [
    {
      id: 1,
      name: 'Product A',
      price: 29.99,
      quantity: 2,
    },
    {
      id: 2,
      name: 'Product B',
      price: 49.99,
      quantity: 1,
    },
  ],
  totalAmount: 109.97,
  address: {
    name: 'John Doe',
    pincode: '123456',
    phoneNumber: '9876543210',
    city: 'Sample City',
    state: 'Sample State',
  },
  createdAt: new Date().toISOString(),
};

export const mockSearchResults: IProduct[] = [
  {
    id: '1',
    title: 'test',
    price: 10,
    image: 'test.jpg',
    category: 'Test Category',
  },
];

export const mockApiError = {
  response: {
    data: 'API request failed',
  },
};

export const emptyMockUser = { name: '', email: '', password: '', id: '' };
