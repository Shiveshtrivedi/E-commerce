export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  error: string | null;
  isAdmin: boolean;
  userEmail: string | null;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

export interface ICredentials {
  name?: string;
  email: string;
  password: string;
}

export interface ICartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICartState {
  items: ICartItem[];
  totalAmount: number;
  userId: string | null;
  totalItems?: number;
}

export interface IProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}
export interface IProductState {
  products: IProduct[];
  adminProductsHistory: IProduct[];
  filterProducts: IProduct[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  id: string | null;
}

export interface IReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface IReviewsState {
  reviews: IReview[];
  error: string | null;
}

export interface IWishListItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface IWishListState {
  items: IWishListItem[];
  userId: string | null;
}

export interface IAdminRouteProps {
  element: React.ReactElement;
}
export interface IPrivateRouteProps {
  element: React.ReactElement;
}

export interface IStarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

export interface IOrder {
  id: string;
  userId: string;
  items: Array<{ id: number; name: string; price: number; quantity: number }>; // Use number here
  totalAmount: number;
  address: {
    name: string;
    pincode: string;
    phoneNumber: string;
    city: string;
    state: string;
  };
  createdAt: string;
}

export interface IOrderState {
  orders: IOrder[];
  userId: string | null;
}
