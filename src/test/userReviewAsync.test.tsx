import { configureStore } from '@reduxjs/toolkit';
import reviewReducer, {
  fetchReviews,
  postReview,
  selectAverageRating,
  selectReviewsForProduct,
} from '../redux/slices/userReviewSlice';
import axios from 'axios';
import { mockReview, mockReviews } from './mockData/mockData';

jest.mock('axios');

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';

describe('userReviewAsync', () => {
  const store = configureStore({ reducer: { reviews: reviewReducer } });

  test('should return all reviews', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: mockReviews,
    });
    await store.dispatch(fetchReviews('1'));
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}?productId=1`);
    const state = store.getState().reviews;
    expect(state.reviews).toEqual(mockReviews);
    expect(state.error).toBe('');
  });

  test('should handle fetch failure', async () => {
    const productId = '1';
    const errorMessage = 'Failed to fetch reviews';
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const store = configureStore({ reducer: { reviews: reviewReducer } });

    await store.dispatch(fetchReviews(productId));

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}?productId=${productId}`);
    const state = store.getState().reviews;

    expect(state.reviews).toEqual([]);
    expect(state.error).toBe(errorMessage);
  });

  test('should post a new review', async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: mockReview,
    });

    const store = configureStore({ reducer: { reviews: reviewReducer } });

    await store.dispatch(postReview(mockReview));

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, mockReview);
    const state = store.getState().reviews;
    expect(state.reviews).toContainEqual(mockReview);
    expect(state.error).toBe('');
  });

  test('should handle post review failure', async () => {
    const errorMessage = 'Failed to post review';
    (axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const store = configureStore({ reducer: { reviews: reviewReducer } });

    await store.dispatch(postReview(mockReview));

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, mockReview);
    const state = store.getState().reviews;
    expect(state.reviews).toEqual([]);
    expect(state.error).toBe(errorMessage);
  });

  test('should return review for specified product', () => {
    const productId = '1';
    const reviews = selectReviewsForProduct(
      store.getState().reviews,
      productId
    );
    expect(reviews).toEqual(mockReviews);
  });

  test('should return an empty array if no reviews for the specified product', () => {
    const productId = '3';
    const reviews = selectReviewsForProduct(
      store.getState().reviews,
      productId
    );
    expect(reviews).toEqual([]);
  });

  test('should return average rating', () => {
    const productId = '1';
    const reviews = selectReviewsForProduct(
      store.getState().reviews,
      productId
    );
    const averageRating = selectAverageRating(
      {
        reviews,
        error: '',
        averageRatings: {},
      },
      productId
    );
    expect(averageRating).toBe(4.5);
  });

  test('should return 0 if there are no reviews for the specified product', () => {
    const productId = '3';
    const reviews = selectReviewsForProduct(
      store.getState().reviews,
      productId
    );
    const averageRating = selectAverageRating(
      {
        reviews,
        error: '',
        averageRatings: {},
      },
      productId
    );
    expect(averageRating).toBe(0);
  });
});
