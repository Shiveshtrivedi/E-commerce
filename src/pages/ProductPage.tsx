import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../components/loading';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/CartSlice';
import ReviewList from '../components/reviewList';
import ReviewForm from '../components/reviewForm';
import StarRating from '../components/starRating';
import { postReview, fetchReviews } from '../redux/slices/UserReviewSlice';
import { AppDispatch, RootState } from '../redux/Store';
import { fetchProducts } from '../redux/slices/ProductSlice';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    description: string;
    rating?: {
      rate: number;
      count: number;
    };
  }

  const [product, setProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();

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
      const productWithDescription: Product = {
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

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: parseInt(product.id),
        name: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    toast.success('Product added to cart');
  };

  const onRatingChange = (value: number) => {
    setProduct((prevProduct: Product | null) => {
      if (prevProduct?.rating) {
        return {
          ...prevProduct,
          rating: {
            ...prevProduct.rating,
            rate:
              (prevProduct.rating.rate * prevProduct.rating.count + value) /
              (prevProduct.rating.count + 1),
            count: prevProduct.rating.count + 1,
          },
        };
      }
      return prevProduct;
    });

    const review = {
      id: Date.now().toString(),
      productId: id,
      userId: 'user1',
      rating: value,
      comment: '',
      timestamp: new Date().toISOString(),
    };

    if (product?.id) {
      dispatch(postReview({ ...review, productId: product.id }));
    }
  };

  return (
    <Container>
      <Image src={product.image} alt={product.title} />
      <Title>{product.title}</Title>
      {product.rating && (
        <StarRating
          rating={product.rating.rate || 0}
          onRatingChange={onRatingChange}
        />
      )}
      <Price>{product.price}$</Price>
      <Description>{product.description}</Description>
      <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
      {product.id && <ReviewForm productId={product.id} userId={'user1'} />}
      {product.id && <ReviewList productId={product.id} />}
    </Container>
  );
};

export default ProductPage;
