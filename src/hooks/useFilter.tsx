import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { IProduct } from '../utils/interface/Interface';
import { useLocation } from 'react-router-dom';

type PriceFilter = 'all' | 'low' | 'medium' | 'high';
type RatingFilter =
  | 'all'
  | '1-star'
  | '2-star'
  | '3-star'
  | '4-star'
  | '5-star';

export const useProductFilter = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get('category');
  const products = useSelector((state: RootState) => state.products.products);
  const averageRatings = useSelector(
    (state: RootState) => state.reviews.averageRatings
  );
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const wishlist = useSelector((state: RootState) => state.wishList.items);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const status = wishlist.reduce(
      (acc, item) => {
        acc[item.id] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setWishlistStatus(status);
  }, [wishlist]);
  useEffect(() => {
    if (category) {
      setCategoryFilter(category);
    }
  }, [category]);

  const handlePriceFilterChange = (filter: PriceFilter) =>
    setPriceFilter(filter);
  const handleRatingFilterChange = (filter: RatingFilter) =>
    setRatingFilter(filter);
  const handleCategoryFilterChange = (category: string) =>
    setCategoryFilter(category);
  const handleViewModeChange = () =>
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');

  const isPriceMatch = (price: number, filter: PriceFilter): boolean => {
    switch (filter) {
      case 'low':
        return price < 50;
      case 'medium':
        return price >= 50 && price < 100;
      case 'high':
        return price >= 100;
      default:
        return true;
    }
  };

  const isRatingMatch = (rating: number, filter: RatingFilter): boolean => {
    switch (filter) {
      case '1-star':
        return rating >= 1 && rating < 2;
      case '2-star':
        return rating >= 2 && rating < 3;
      case '3-star':
        return rating >= 3 && rating < 4;
      case '4-star':
        return rating >= 4 && rating < 5;
      case '5-star':
        return rating === 5;
      default:
        return true;
    }
  };

  const isCategoryMatch = (category: string, filter: string): boolean => {
    return filter === 'all' || category === filter;
  };

  const isSearchMatch = (title: string, searchTerm: string): boolean => {
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredProducts: IProduct[] = products.filter((product: IProduct) => {
    const averageRating = averageRatings[product.id] || 0;

    return (
      isPriceMatch(product.price, priceFilter) &&
      isRatingMatch(averageRating, ratingFilter) &&
      isCategoryMatch(product.category, categoryFilter) &&
      isSearchMatch(product.title, searchTerm)
    );
  });

  return {
    filteredProducts,
    priceFilter,
    ratingFilter,
    categoryFilter,
    viewMode,
    wishlistStatus,
    handlePriceFilterChange,
    handleRatingFilterChange,
    handleCategoryFilterChange,
    handleViewModeChange,
  };
};
