import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { IReview, IReviewsState } from '../../utils/type/types';

const initialState: IReviewsState = {
  reviews: [],
  averageRatings: {},
  error: '',
};

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

export const fetchReviews = createAsyncThunk<
  IReview[],
  string,
  { rejectValue: string }
>('reviews/fetchReviews', async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}?productId=${productId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch reviews');
  }
});

export const postReview = createAsyncThunk<
  IReview,
  IReview,
  { rejectValue: string }
>('reviews/postReview', async (review, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, review);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to post review');
  }
});

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.error = '';
      })
      .addCase(
        fetchReviews.fulfilled,
        (state, action: PayloadAction<IReview[]>) => {
          state.reviews = action.payload;
          state.error = '';
          const productId = action.payload[0]?.productId;
          if (productId) {
            const productReviews = state.reviews.filter(
              (review) => review.productId === productId
            );
            const totalRating = productReviews.reduce(
              (acc, review) => acc + review.rating,
              0
            );
            const averageRating = productReviews.length
              ? totalRating / productReviews.length
              : 0;
            state.averageRatings[productId] = averageRating; // Store average rating
          }
        }
      )
      .addCase(
        fetchReviews.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Failed to fetch reviews';
        }
      )
      .addCase(postReview.pending, (state) => {
        state.error = '';
      })
      .addCase(
        postReview.fulfilled,
        (state, action: PayloadAction<IReview>) => {
          state.reviews.push(action.payload);
          state.error = '';

          const productId = action.payload.productId;
          const productReviews = state.reviews.filter(
            (review) => review.productId === productId
          );
          const totalRating = productReviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const averageRating = productReviews.length
            ? totalRating / productReviews.length
            : 0;
          state.averageRatings[productId] = averageRating;
        }
      )
      .addCase(
        postReview.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? 'Failed to post review';
        }
      );
  },
});

export const selectReviewsForProduct = (
  state: IReviewsState,
  productId: string
) => state.reviews.filter((review) => review.productId === productId);

export const selectAverageRating = createSelector(
  [selectReviewsForProduct],
  (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  }
);

export default reviewSlice.reducer;
