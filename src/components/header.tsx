import React, { useState } from 'react';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { BsCart } from 'react-icons/bs';
import { setSearchTerm } from '../redux/slices/SearchSlice';
import { Link } from 'react-router-dom';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 25px;
  background-color: #e8c995;
  box-shadow: 0 2px 4px #00000020;
  transition: background-color 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 25px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
  flex-grow: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SearchBar = styled.input`
  padding: 5px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  width: 200px;

  @media (max-width: 768px) {
    width: 150px;
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledLink = styled(Link)`
  color: #333333;
  text-decoration: none;
  margin: 5px;

  &:hover {
    color: #555555;
    text-decoration: underline;
  }
`;

const CartIcon = styled(BsCart)`
  font-size: 33px;
  color: #333333;
  transition: color 0.3s ease;
  position: absolute;
  right: 30px;

  &:hover {
    color: #555555;
  }

  @media (max-width: 768px) {
    font-size: 28px;
    right: 20px;
  }
`;

const CartItems = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-left: 8px;
  position: relative;
  top: -7px;
  background-color: #ffffff;
  padding: 2px 6px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 1px 5px;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const DropdownButton = styled.button`
  background-color: #e8c995;
  border: none;
  color: #333333;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 0;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 200px;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    top: 100%;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  color: #333333;
  padding: 10px 15px;
  text-decoration: none;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const DropdownContainerHover = styled(DropdownContainer)`
  &:hover ${DropdownMenu} {
    display: block;
  }
`;

const ImageLogo = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
  text-transform: uppercase;

  img {
    height: 80px;
    width: 80px;
    margin-right: 15px;
    border-radius: 50%;
    box-shadow: 0 4px 6px #00000050;
  }

  &:hover {
    color: #4caf50;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    img {
      height: 60px;
      width: 60px;
    }
  }
`;

const Header: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const user = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const totalCartItems = useSelector(
    (state: RootState) => state.cart.totalItems
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchInput));
  };

  return (
    <HeaderWrapper>
      <Logo>
        <StyledLink to="/">
          <ImageLogo>
            <img
              src="https://www.onlinelogomaker.com/blog/wp-content/uploads/2017/06/shopping-online.jpg"
              alt="logo"
            />
          </ImageLogo>
          E-commerce Store
        </StyledLink>
      </Logo>
      <Nav>
        {user && (
          <>
            <StyledLink to="/products">Products</StyledLink>
            {isAdmin && <StyledLink to="/addProduct">Add Product</StyledLink>}
            <StyledLink to="/contact">Contact</StyledLink>
            <StyledLink to="/about">About</StyledLink>
            <form onSubmit={handleSearch}>
              <SearchBar
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
              />
            </form>
            <StyledLink to="/cart">
              <CartIcon />
            </StyledLink>
            <DropdownContainerHover>
              <DropdownButton onClick={toggleDropdown}>
                My Account
              </DropdownButton>
              <DropdownMenu
                isOpen={isDropdownOpen}
                onMouseLeave={closeDropdown}
              >
                <DropdownItem to="/profile">My Profile</DropdownItem>
                <DropdownItem to="/wishList">Wishlist</DropdownItem>
                <DropdownItem to="/orderHistory">Order</DropdownItem>
                {isAdmin && (
                  <DropdownItem to="/adminHistory">History</DropdownItem>
                )}
              </DropdownMenu>
            </DropdownContainerHover>
          </>
        )}
        {!user && (
          <UserActions>
            <StyledLink to="/login">Login</StyledLink>
            <StyledLink to="/signup">SignUp</StyledLink>
          </UserActions>
        )}
      </Nav>
      {user && <CartItems>{totalCartItems}</CartItems>}
    </HeaderWrapper>
  );
};

export default Header;
