import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/Store';
import { signup } from '../redux/slices/AuthSlice';
import styled from 'styled-components';

const SignupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const SignupFormContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 10px;
    max-width: 95%;
  }
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 8px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    margin-bottom: 10px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    font-size: 12px;
  }
`;

const ErrorText = styled.p`
  color: #ff0000;
  text-align: center;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const SignupForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = useSelector((state: RootState) => state.auth.error);

  const passwordValidationRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string) => {
    return emailValidationRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return passwordValidationRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 8 characters long, include one capital letter, and one special character.'
      );
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!isValid) return;

    try {
      await dispatch(signup({ name, email, password })).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Failed to signup:', err);
    }
  };

  return (
    <SignupWrapper>
      <SignupFormContainer>
        <Title>Signup Page</Title>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <ErrorText>{emailError}</ErrorText>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <ErrorText>{passwordError}</ErrorText>}
          </div>
          <Button type="submit">Signup</Button>
          {error && <ErrorText>{error}</ErrorText>}
        </form>
      </SignupFormContainer>
    </SignupWrapper>
  );
};

export default SignupForm;
