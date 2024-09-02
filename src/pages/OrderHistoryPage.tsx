import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { initializeOrders } from '../redux/slices/OrderSlice';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000020;
  max-width: 800px;
  margin: 20px auto;
  height: auto;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 95%;
  }
`;

const OrderCard = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const OrderDetails = styled.div`
  margin-bottom: 10px;
`;

const OrderDate = styled.p`
  font-size: 14px;
  color: #777;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
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
