import { toast } from 'react-toastify';
import { addToCart } from '../redux/slices/CartSlice';
import { useDispatch } from 'react-redux';
import { IProduct } from '../utils/interface/types';

export const useAddToCart = () => {
  const dispatch = useDispatch();
  const handleAddToCart = (product: IProduct) => {
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
  return handleAddToCart;
};
