import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/Store';
import { addProduct, addProductToHistory } from '../redux/slices/ProductSlice';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const FormContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  max-width: 500px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  box-sizing: border-box;
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
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

const AddProductPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('electronics');

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      id: Date.now().toString(),
      title,
      price: parseFloat(price),
      image,
      category,
    };
    dispatch(addProduct(product));
    dispatch(addProductToHistory(product));
    toast.success('Product added successfully');
    setTitle('');
    setPrice('');
    setImage('');
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Price (in USD)</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </FormGroup>
        <FormGroup>
          <Label>Image URL </Label>
          <Input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Category</Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelry</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
          </Select>
        </FormGroup>
        <SubmitButton type="submit">Add Product</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default AddProductPage;
