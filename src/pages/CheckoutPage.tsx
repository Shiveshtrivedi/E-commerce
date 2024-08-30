import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/CartSlice';
import { AppDispatch, RootState } from '../redux/Store';
import { saveAddressToCookies } from '../utils/CookieUtils';
import { addOrder } from '../redux/slices/OrderSlice';
import { IOrder } from '../utils/interface/Interface';

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const CheckoutTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
`;

const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormLabel = styled.label`
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
`;

const FormInput = styled.input`
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const CheckoutPage: React.FC = () => {
  const [name, setName] = useState('');
  const [pincode, setPincode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const userId = useSelector((state: RootState) => state.cart.userId);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('cart item in chekcout ', cartItems);
    e.preventDefault();

    if (!userId) {
      alert('User is not logged in.');
      return;
    }

    const addressDetails = {
      name,
      pincode,
      phoneNumber,
      city,
      state,
    };

    saveAddressToCookies(userId, addressDetails);

    const newOrder: IOrder = {
      id: Date.now().toString(),
      userId,
      items: cartItems.map((item) => ({
        ...item,
        id: Number(item.id),
      })),
      totalAmount,
      address: addressDetails,
      createdAt: new Date().toISOString(),
    };

    console.log('New Order Created:', newOrder);
    dispatch(addOrder(newOrder));

    dispatch(clearCart());

    navigate('/checkout/success');
  };

  return (
    <CheckoutContainer>
      <CheckoutTitle>Checkout</CheckoutTitle>
      <CheckoutForm onSubmit={handleSubmit}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormInput
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <FormLabel htmlFor="pincode">Pincode</FormLabel>
        <FormInput
          type="text"
          id="pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          required
        />

        <FormLabel htmlFor="phone">Phone Number</FormLabel>
        <FormInput
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <FormLabel htmlFor="city">City</FormLabel>
        <FormInput
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <FormLabel htmlFor="state">State</FormLabel>
        <FormInput
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />

        <SubmitButton type="submit">Place Order</SubmitButton>
      </CheckoutForm>
    </CheckoutContainer>
  );
};

export default CheckoutPage;
