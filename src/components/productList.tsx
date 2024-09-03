import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/Store';
import {
  deleteProduct,
  fetchProducts,
  resetFilter,
} from '../redux/slices/ProductSlice';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Loading from './loading';
import { addToCart } from '../redux/slices/CartSlice';
import { addToWishList, removeToWishList } from '../redux/slices/WishlistSlice';
import { toast } from 'react-toastify';
import { fetchReviews } from '../redux/slices/UserReviewSlice';
import { IProduct, IWishListItem } from '../utils/interface/Interface';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import NoProductFound from './noProductFound';
import MyPieChart from './pieChart';
import Star from './star';

const Container = styled.div`
  display: flex;
  max-width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterBox = styled.div`
  width: 15%;
  padding: 20px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  box-shadow: 0 0 10px #00000020;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 90%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
`;

const ProductBox = styled.div<{ viewMode: string }>`
  width: 85%;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-direction: ${(props) => (props.viewMode === 'grid' ? 'row' : 'column')};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterDropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const Image = styled.img`
  width: 120px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
  box-shadow: 0 0 10px #00000020;

  @media (max-width: 768px) {
    width: 100px;
    height: 130px;
  }
`;

const Price = styled.p`
  font-size: 16px;
  color: #666666;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
const Button = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  height: 40px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 6px #00000020;
  margin-top: 10px;
  transition: background-color 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const ProductNameContainer = styled.div`
  position: relative;
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    max-width: 150px;
  }
`;

const FilterButton = styled.button`
  color: #4caf50;
  background-color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 0 10px #00000060;
  transition: background-color 0.2s ease-in-out;
  margin: 20px 20px;

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
    margin: 10px 10px;
  }
`;

const ToggleButton = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 10px 10px 5px;
  box-shadow: 0 0 10px #00000040;
  transition: background-color 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const ProductGridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  width: 27%;
  margin: 10px;
  border-radius: 10px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
    margin: 5px 0;
  }
`;

const ProductListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px #00000010;

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 10px;

    img {
      width: 80px;
      height: 100px;
      margin-bottom: 15px;
    }

    div {
      flex: 1;
      margin-bottom: 10px;
    }
  }
`;

const WishlistButton = styled.div<{ viewMode: string; isInWishlist: boolean }>`
  background-color: ${(props) => (props.isInWishlist ? '#e64a19' : '#ff5722')};
  background-color: #ff5722;
  color: #ffffff;
  padding: 8px 1px 8px 1px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 0 0;
  font-size: 16px;
  font-weight: bold;
  width: ${(props) => (props.viewMode === 'list' ? '90px' : '50px')};
  box-shadow: 0 4px 6px #00000020;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;

  @media (max-width: 768px) {
    padding: 6px;
    font-size: 14px;
    margin-left: 2px;
  }
`;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);
  const status = useSelector((state: RootState) => state.products.status);
  const error = useSelector((state: RootState) => state.products.error);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const averageRatings = useSelector(
    (state: RootState) => state.reviews.averageRatings
  );
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  type PriceFilter = 'all' | 'low' | 'medium' | 'high';

  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  type RatingFilter =
    | 'all'
    | '1-star'
    | '2-star'
    | '3-star'
    | '4-star'
    | '5-star';

  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>(
    {}
  );
  const wishlist = useSelector((state: RootState) => state.wishList.items);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get('category') ?? 'all';

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    } else if (status === 'succeeded') {
      products.forEach((product: IProduct) => {
        dispatch(fetchReviews(product.id));
      });
    }
  }, [dispatch, status, products]);

  useEffect(() => {
    if (category) {
      setCategoryFilter(category);
    }
  }, [category]);

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

  const handlePriceFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriceFilter(event.target.value as 'all' | 'low' | 'medium' | 'high');
  };

  const handleRatingFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRatingFilter(
      event.target.value as
        | 'all'
        | '1-star'
        | '2-star'
        | '3-star'
        | '4-star'
        | '5-star'
    );
  };

  const handleCategoryFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategoryFilter(event.target.value);
  };

  const isPriceMatch = (
    price: number,
    filter: 'all' | 'low' | 'medium' | 'high'
  ): boolean => {
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

  const isRatingMatch = (
    rating: number,
    filter: 'all' | '1-star' | '2-star' | '3-star' | '4-star' | '5-star'
  ): boolean => {
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

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'failed') {
    return <div>{error}</div>;
  }

  const handleAddToCart = (product: IProduct) => {
    dispatch(
      addToCart({
        id: parseInt(product.id),
        name: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    toast.success('Item added to cart');
  };

  const handleAddToWishlist = (product: IProduct) => {
    const wishListItem: IWishListItem = {
      id: parseInt(product.id),
      name: product.title,
      price: product.price,
      image: product.image,
    };

    if (wishlist.some((item) => item.id === wishListItem.id)) {
      dispatch(removeToWishList(wishListItem.id));
      toast.error(`Removed from wishlist`);
    } else {
      dispatch(addToWishList(wishListItem));
      toast.success(`Added to wishlist`);
    }
  };

  const handleToDelete = (id: string) => {
    dispatch(deleteProduct(id));
    toast.error('Item deleted');
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());
    setPriceFilter('all');
    setRatingFilter('all');
    setCategoryFilter('all');
  };

  return (
    <Container>
      <FilterBox>
        <FilterDropdown value={priceFilter} onChange={handlePriceFilterChange}>
          <option value="all">All Prices</option>
          <option value="low">Low ($50)</option>
          <option value="medium">Medium ($50 - $100)</option>
          <option value="high">High (≥ $100)</option>
        </FilterDropdown>

        <FilterDropdown
          value={ratingFilter}
          onChange={handleRatingFilterChange}
        >
          <option value="all">All Ratings</option>
          <option value="1-star">1 Star</option>
          <option value="2-star">2 Stars</option>
          <option value="3-star">3 Stars</option>
          <option value="4-star">4 Stars</option>
          <option value="5-star">5 Stars</option>
        </FilterDropdown>

        <FilterDropdown
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelry</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
        </FilterDropdown>

        <FilterButton onClick={handleResetFilter}>Reset Filters</FilterButton>
        <ToggleButton
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          {viewMode === 'grid' ? 'List' : 'Grid'} View
        </ToggleButton>
        <MyPieChart />
      </FilterBox>

      {filteredProducts.length === 0 ? (
        <NoProductFound />
      ) : (
        <ProductBox viewMode={viewMode}>
          {filteredProducts.map((product: IProduct) =>
            viewMode === 'grid' ? (
              <ProductGridItem key={product.id}>
                <Link to={`/products/${product.id}`} title={product.title}>
                  <Image src={product.image} alt={product.title} />
                </Link>
                <Link to={`/products/${product.id}`} title={product.title}>
                  <ProductNameContainer data-title={product.title}>
                    {product.title}
                  </ProductNameContainer>
                </Link>
                <Price>{product.price}$</Price>
                <Star reviews={averageRatings[product.id] || 0} />{' '}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <WishlistButton
                    viewMode={viewMode}
                    isInWishlist={wishlistStatus[product.id] || false}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    {wishlistStatus[product.id] ? (
                      <AiFillHeart />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </WishlistButton>
                  <Button onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </div>
                {isAdmin && (
                  <Button onClick={() => handleToDelete(product.id)}>
                    Delete
                  </Button>
                )}
              </ProductGridItem>
            ) : (
              <ProductListItem key={product.id}>
                <Link to={`/products/${product.id}`} title={product.title}>
                  <Image src={product.image} alt={product.title} />
                </Link>
                <Link to={`/products/${product.id}`} title={product.title}>
                  <ProductNameContainer data-title={product.title}>
                    {product.title}
                  </ProductNameContainer>
                </Link>
                <Price>${product.price}</Price>
                <Star reviews={averageRatings[product.id] || 0} />{' '}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <WishlistButton
                    viewMode={viewMode}
                    isInWishlist={wishlistStatus[product.id] || false}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    {wishlistStatus[product.id] ? (
                      <AiFillHeart />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </WishlistButton>
                  <Button onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </div>
                {isAdmin && (
                  <Button onClick={() => handleToDelete(product.id)}>
                    Delete
                  </Button>
                )}
              </ProductListItem>
            )
          )}
        </ProductBox>
      )}
    </Container>
  );
};

export default ProductList;
