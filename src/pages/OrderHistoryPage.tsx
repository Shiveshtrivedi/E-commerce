import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { initializeOrders } from '../redux/slices/OrderSlice';
import styled from 'styled-components';
import { getOrdersFromCookies } from '../utils/CookieUtils';

const HistoryContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const OrderCard = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const OrderDetails = styled.div`
  margin-bottom: 10px;
`;

const OrderDate = styled.p`
  font-size: 14px;
  color: #777;
`;

const OrderHistoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.orders);
  const userId = useSelector((state: RootState) => state.cart.userId);

  useEffect(() => {
    if (userId) {
      dispatch(initializeOrders(userId));
    }
  }, [userId, dispatch]);

  const userOrders = orders.filter((order) => order.userId === userId);
  console.log('User Orders:', userOrders);
  const checkcookierorder = userId ? getOrdersFromCookies(userId) : null;
  console.log('checkcookierorder', checkcookierorder);

  return (
    <HistoryContainer>
      <h1>Order History</h1>
      {userOrders.map((order) => (
        <OrderCard key={order.id}>
          <OrderDate>
            Order Date: {new Date(order.createdAt).toLocaleDateString()}
          </OrderDate>
          <OrderDetails>
            <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
          </OrderDetails>
          <OrderDetails>
            <strong>Address:</strong> {order.address.name}, {order.address.city}
            , {order.address.state}, {order.address.pincode}
          </OrderDetails>
          <OrderDetails>
            <strong>Items:</strong>
            {order.items.length === 0 ? (
              <p>No items found.</p>
            ) : (
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - ${item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
            )}
          </OrderDetails>
        </OrderCard>
      ))}
    </HistoryContainer>
  );
};

export default OrderHistoryPage;
