import React from 'react';
import styled from 'styled-components';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';

const StarContainer = styled.div`
  display: flex;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${({ filled }) => (filled ? '#f39c12' : '#dcdcdc')};
  font-size: 24px;
`;

const TestStar = ({ reviews }: { reviews: number }) => {
  const ratingStar = Array.from({ length: 5 }, (_, index) => {
    const number = index + 0.5;
    const stars = reviews;
    const filled = stars >= index + 1;
    const halfFilled = stars >= number && stars < index + 1;
    let starIcon;

    if (filled) {
      starIcon = <FaStar />;
    } else if (halfFilled) {
      starIcon = <FaStarHalfAlt />;
    } else {
      starIcon = <AiOutlineStar />;
    }

    return (
      <Star key={index} filled={filled || halfFilled}>
        {starIcon}
      </Star>
    );
  });

  return <StarContainer>{ratingStar}</StarContainer>;
};

export default TestStar;
