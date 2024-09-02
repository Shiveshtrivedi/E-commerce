import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../redux/Store';
import { initializeOrders } from '../redux/slices/OrderSlice';
import { getOrdersFromCookies } from '../utils/CookieUtils';
import { useNavigate } from 'react-router-dom';

const loadRazorpayScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

const Container = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000020;
`;

const OrderSummary = styled.div`
  margin-bottom: 20px;
`;

const OrderTitle = styled.h2`
  margin-bottom: 15px;
  color: #333;
`;

const OrderDetail = styled.p`
  margin-bottom: 8px;
  color: #555;
  font-size: 16px;
`;

const OrderItems = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const OrderItem = styled.li`
  margin-bottom: 5px;
  color: #555;
  font-size: 16px;
`;

const PayButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingMessage = styled.p`
  color: #777;
  font-size: 18px;
  text-align: center;
`;

const PaymentPage: React.FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.orders);
  const userId = useSelector((state: RootState) => state.cart.userId);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      dispatch(initializeOrders(userId));
      const checkcookieOrder = getOrdersFromCookies(userId);
      if (checkcookieOrder) {
        setLatestOrder(checkcookieOrder);
      }
    }
  }, [userId, dispatch]);

  useEffect(() => {
    loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const sortedOrders = [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setLatestOrder(sortedOrders[0]);
    }
  }, [orders]);

  const handlePayment = () => {
    if (!latestOrder) return;

    const options: any = {
      key: 'rzp_test_8aCsFUFy8E4VoU',
      amount: latestOrder.totalAmount * 100, 
      currency: 'INR',
      name: 'ITT',
      description: 'Test Transaction',
      handler: function (response: any) {
        alert(`Payment ID: ${response.razorpay_payment_id}`);
        navigate('/checkout/success');
      },
      prefill: {
        name: 'shivesh trivedi',
        email: 'shiveshtrivedi@gmail.com',
        contact: '9999999999',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <Container>
      {latestOrder ? (
        <OrderSummary>
          <OrderTitle>Order Summary</OrderTitle>
          <OrderDetail>
            <strong>Order Date:</strong>{' '}
            {new Date(latestOrder.createdAt).toLocaleDateString()}
          </OrderDetail>
          <OrderDetail>
            <strong>Total Amount:</strong> ${latestOrder.totalAmount.toFixed(2)}
          </OrderDetail>
          <OrderDetail>
            <strong>Address:</strong> {latestOrder.address.name},{' '}
            {latestOrder.address.city}, {latestOrder.address.state},{' '}
            {latestOrder.address.pincode}
          </OrderDetail>
          <OrderDetail>
            <strong>Items:</strong>
          </OrderDetail>
          <OrderItems>
            {latestOrder.items.length === 0 ? (
              <OrderItem>No items found.</OrderItem>
            ) : (
              latestOrder.items.map((item: any) => (
                <OrderItem key={item.id}>
                  {item.name} - ${item.price} x {item.quantity}
                </OrderItem>
              ))
            )}
          </OrderItems>
          <PayButton onClick={handlePayment}>Pay Now</PayButton>
        </OrderSummary>
      ) : (
        <LoadingMessage>Loading order summary...</LoadingMessage>
      )}
    </Container>
  );
};

export default PaymentPage;
