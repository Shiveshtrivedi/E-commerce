export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage?: string;
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
  totalItems: number;
}

export interface IProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  category: string;
  rating?: {
    rate: number;
    count: number;
  };
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
  items: Array<{ id: number; name: string; price: number; quantity: number }>;
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

export interface IReviewFormProps {
  productId: string;
  userId: string;
}

export interface ISearchState {
  searchTerm: string;
  searchResults: IProduct[];
}

export interface IReviewsState {
  reviews: IReview[];
  averageRatings: Record<string, number>;
  error: string | null;
}

export interface ICookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export interface IAddressDetails {
  name: string;
  pincode: string;
  phoneNumber: string;
  city: string;
  state: string;
}

export type TRatingFilter =
  | 'all'
  | '1-star'
  | '2-star'
  | '3-star'
  | '4-star'
  | '5-star';

export type TPriceFilter = 'all' | 'low' | 'medium' | 'high';

export type TCategoryFilter =
  | 'all'
  | 'electronics'
  | 'books'
  | 'clothing'
  | 'home';

export enum EStatus {
  Idle = 'idle',
  Loading = 'loading',
  Succeeded = 'succeeded',
  Failed = 'failed',
}
