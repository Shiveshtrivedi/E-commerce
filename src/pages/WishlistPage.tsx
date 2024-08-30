import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { removeToWishList } from '../redux/slices/WishlistSlice';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const WishlistContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  max-width: 600px;
  height: 383px;
  margin: 0 auto;
  overflow-y: auto; /* Allows scrolling if content overflows */

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 95%;
    height: auto; /* Adjust height for mobile */
  }
`;

const WishlistItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    padding: 8px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 6px;
    margin-bottom: 6px;
  }
`;

const ItemImage = styled.img`
  width: 75px;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
  margin-right: 15px;

  @media (max-width: 768px) {
    width: 60px;
    height: 80px;
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 70px;
    margin-right: 5px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ItemPrice = styled.p`
  font-size: 16px;
  color: #555555;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const EmptyWishlistMessage = styled.p`
  font-size: 18px;
  color: #666666;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ItemNameLink = styled(Link)`
  text-decoration: none;
  color: #333;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const WishlistPage: React.FC = () => {
  const dispatch = useDispatch();
  const wishListItems = useSelector((state: RootState) => state.wishList.items);

  return (
    <WishlistContainer>
      <h1>Wishlist</h1>
      {wishListItems.length === 0 ? (
        <EmptyWishlistMessage>Your wishlist is empty.</EmptyWishlistMessage>
      ) : (
        wishListItems.map((item) => (
          <WishlistItem key={item.id}>
            <Link to={`/products/${item.id}`} title={item.name}>
              <ItemImage src={item.image} alt={item.name} />
            </Link>
            <ItemDetails>
              <ItemNameLink to={`/products/${item.id}`} title={item.name}>
                <ItemName>{item.name}</ItemName>
              </ItemNameLink>
              <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
            </ItemDetails>
            <RemoveButton
              onClick={() => {
                dispatch(removeToWishList(item.id));
                toast.error('Item removed from wishlist');
              }}
            >
              Remove
            </RemoveButton>
          </WishlistItem>
        ))
      )}
    </WishlistContainer>
  );
};

export default WishlistPage;
