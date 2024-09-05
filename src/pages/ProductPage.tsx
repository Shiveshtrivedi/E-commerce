import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../components/loading';
import ReviewList from '../components/reviewList';
import ReviewForm from '../components/reviewForm';
import { fetchReviews } from '../redux/slices/userReviewSlice';
import { AppDispatch, RootState } from '../redux/store';
import { fetchProducts } from '../redux/slices/productSlice';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Star from '../components/star';
import { useAddToCart } from '../hooks/useCart';
import { useDispatch, useSelector } from 'react-redux';
import { IProduct } from '../utils/interface/types';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px #00000020;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 300px;
  height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 20px;
  color: #666666;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #333333;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #3e8e41;
  }
`;

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const handleAddToCart = useAddToCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const averageRating = useSelector(
    (state: RootState) => state.reviews.averageRatings[id ?? ''] || 0
  );

  const products = useSelector((state: RootState) => state.products.products);
  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      dispatch(fetchProducts())
        .unwrap()
        .then(() => setLoading(false))
        .catch(() => {
          setError('Failed to fetch products');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [products, dispatch]);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id.toString() === id);
    if (foundProduct) {
      const productWithDescription: IProduct = {
        ...foundProduct,
        description: '',
      };
      setProduct(productWithDescription);
    } else if (!loading) {
      setError('Product not found');
    }
  }, [products, id, loading]);
  useEffect(() => {
    if (product) {
      dispatch(fetchReviews(product.id));
    }
  }, [product, dispatch]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <Container>
      <Zoom>
        <Image src={product.image} alt={product.title} />
      </Zoom>
      <Title>{product.title}</Title>
      <Star reviews={averageRating} />
      <Price>{product.price}$</Price>
      <Description>{product.description}</Description>
      <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
      {product.id && <ReviewForm productId={product.id} userId={'user1'} />}
      {product.id && <ReviewList productId={product.id} />}
    </Container>
  );
};

export default ProductPage;
