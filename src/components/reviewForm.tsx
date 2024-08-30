import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postReview } from '../redux/slices/UserReviewSlice';
import { AppDispatch } from '../redux/Store';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 20px;
  color: #333;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 7.5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 17px;
  box-sizing: border-box;
  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 7.5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  box-sizing: border-box;
  resize: none;
  height: 120px;
  overflow-y: auto;
  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  padding: 7.5px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
`;

interface ReviewFormProps {
  productId: string;
  userId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = {
      id: Date.now().toString(),
      productId,
      userId,
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };
    dispatch(postReview(newReview))
      .then(() => toast.success('Rating submitted successfully'))
      .catch(() => toast.error('Failed to submit rating'));
    setComment('');
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="rating">Rating:</Label>
          <Input
            type="number"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            min="1"
            max="5"
            id="rating"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="comment">Comment:</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Submit Review</SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default ReviewForm;
