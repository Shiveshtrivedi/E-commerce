import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  deleteProduct,
  fetchProducts,
  resetFilter,
} from '../redux/slices/productSlice';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { addToWishList, removeToWishList } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { fetchReviews } from '../redux/slices/userReviewSlice';
import {
  IProduct,
  IWishListItem,
  TPriceFilter,
  TRatingFilter,
  EStatus,
} from '../utils/type/types';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import NoProductFound from './noProductFound';
import MyPieChart from './pieChart';
import Star from './star';
import { useAddToCart } from '../hooks/useCart';
import { useProductFilter } from '../hooks/useFilter';
import Loading from './loading';
import NetworkErrorPage from './networkError';

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

const DeleteButton = styled(Button)`
  background-color: #dc3545;
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
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const handleAddToCart = useAddToCart();
  const {
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
  } = useProductFilter();
  const averageRatings = useSelector(
    (state: RootState) => state.reviews.averageRatings
  );

  const wishlist = useSelector((state: RootState) => state.wishList.items);

  useEffect(() => {
    if (status === EStatus.Idle) {
      dispatch(fetchProducts());
    } else if (status === EStatus.Succeeded) {
      products.forEach((product: IProduct) => {
        dispatch(fetchReviews(product.id));
      });
    }
  }, [dispatch, status, products]);

  if (status === EStatus.Loading) {
    return <Loading />;
  }

  if (status === EStatus.Failed) {
    return (
      <div>
        <NetworkErrorPage />
      </div>
    );
  }

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

    handlePriceFilterChange('all');
    handleRatingFilterChange('all');
    handleCategoryFilterChange('all');
  };

  return (
    <Container>
      <FilterBox>
        <FilterDropdown
          value={priceFilter}
          onChange={(e) =>
            handlePriceFilterChange(e.target.value as TPriceFilter)
          }
        >
          <option value="all">All Prices</option>
          <option value="low">Low ($50)</option>
          <option value="medium">Medium ($50 - $100)</option>
          <option value="high">High (≥ $100)</option>
        </FilterDropdown>

        <FilterDropdown
          value={ratingFilter}
          onChange={(e) =>
            handleRatingFilterChange(e.target.value as TRatingFilter)
          }
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
          onChange={(e) => handleCategoryFilterChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelry</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
        </FilterDropdown>

        <FilterButton onClick={handleResetFilter}>Reset Filters</FilterButton>
        <ToggleButton onClick={handleViewModeChange}>
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
                  <DeleteButton onClick={() => handleToDelete(product.id)}>
                    Delete
                  </DeleteButton>
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
                  <DeleteButton onClick={() => handleToDelete(product.id)}>
                    Delete
                  </DeleteButton>
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
