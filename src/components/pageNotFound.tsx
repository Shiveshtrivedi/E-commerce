import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
  text-align: center;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Heading = styled.h1`
  font-size: 96px;
  color: #ff6347;
  margin: 0;
  animation: ${bounce} 2s infinite;
`;

const SubHeading = styled.h2`
  font-size: 32px;
  color: #555555;
`;

const Message = styled.p`
  font-size: 18px;
  color: #888888;
  margin-top: 20px;
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Heading>404</Heading>
      <SubHeading>Page Not Found</SubHeading>
      <Message>Sorry, the page you're looking for doesn't exist.</Message>
    </Container>
  );
};

export default NotFoundPage;
