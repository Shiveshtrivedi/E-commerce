import React from 'react';
import styled from 'styled-components';
import { IStarRatingProps } from '../utils/interface/Interface';

const StarContainer = styled.div`
  display: flex;
  direction: row;
`;

const Star = styled.span<{ filled: boolean; interactive: boolean }>`
  color: ${(props) => (props.filled ? '#ffc107' : '#e4e5e9')};
  cursor: ${(props) => (props.interactive ? 'pointer' : 'default')};
  font-size: 20px;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => (props.interactive ? '#ffc107' : '')};
  }
`;

const StarRating: React.FC<IStarRatingProps> = ({
  rating,
  onRatingChange,
  interactive = true,
}) => {
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <StarContainer>
      {[...Array(5)].map((_, index) => (
        <Star
          key={`star-${index}-${Math.random().toString(36).substr(2, 9)}`}
          filled={index < rating}
          onClick={() => handleClick(index)}
          interactive={interactive}
        >
          &#9733;
        </Star>
      ))}
    </StarContainer>
  );
};

export default StarRating;
