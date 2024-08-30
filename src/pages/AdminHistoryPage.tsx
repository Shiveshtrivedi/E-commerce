import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/Store';
import {
  clearHistory,
  removeProductFromHistory,
} from '../redux/slices/ProductSlice';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.h1`
  font-size: 24px;
  color: #333;
  text-align: center;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 18px;
`;

const ProductList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProductItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductTitle = styled.p`
  font-weight: bold;
  margin: 0;
`;

const ProductPrice = styled.p`
  color: #555;
  margin: 5px 0;
`;

const ActionButton = styled.button`
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const ClearHistoryButton = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
  display: block;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const AdminHistoryPage: React.FC = () => {
  const adminProductsHistory = useSelector(
    (state: RootState) => state.products.adminProductsHistory
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveProduct = (productId: string) => {
    dispatch(removeProductFromHistory(productId));
    toast.error('Product removed from history');
  };

  const handleClearHistory = () => {
    dispatch(clearHistory());
    toast.error('History Cleared');
  };

  return (
    <PageContainer>
      <Header>Admin History Page</Header>
      {adminProductsHistory.length === 0 ? (
        <EmptyMessage>Your History Is Empty</EmptyMessage>
      ) : (
        <ProductList>
          {adminProductsHistory.map((product) => (
            <ProductItem key={product.id}>
              <ProductImage src={product.image} alt={product.title} />
              <ProductDetails>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
              </ProductDetails>
              <ActionButton
                onClick={() => handleRemoveProduct(product.id)}
                aria-label={`Remove ${product.title} from history`}
              >
                Remove
              </ActionButton>
            </ProductItem>
          ))}
          <ClearHistoryButton
            onClick={handleClearHistory}
            aria-label="Clear all history"
          >
            Clear History
          </ClearHistoryButton>
        </ProductList>
      )}
    </PageContainer>
  );
};

export default AdminHistoryPage;
