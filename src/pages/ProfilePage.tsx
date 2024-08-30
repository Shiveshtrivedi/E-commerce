import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/Store';
import { logout } from '../redux/slices/AuthSlice';
import axios from 'axios';
import Loading from '../components/loading';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  getAddressFromCookies,
  saveAddressToCookies,
} from '../utils/CookieUtils';

const Container = styled.div`
  max-width: 800px;
  margin: 10px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const ProfileInfo = styled.div`
  margin-bottom: 20px;
`;

const InfoText = styled.p`
  font-size: 18px;
  color: #555;
  margin-bottom: 10px;
`;

const Button = styled.button`
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(38, 143, 255, 0.5);
  }
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [userData, setUserData] = useState<{ name: string; email: string }>({
    name: '',
    email: '',
  });
  const [address, setAddress] = useState<{
    name: string;
    pincode: string;
    phoneNumber: string;
    city: string;
    state: string;
  }>({
    name: '',
    pincode: '',
    phoneNumber: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(true);

  const api_url = process.env.REACT_APP_USER_API_URL;
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const response = await axios.get(`${api_url}/${user.id}`);
          setUserData(response.data);

          const userAddress = getAddressFromCookies(user.id);
          if (userAddress) {
            setAddress(userAddress);
          }
        } catch (error) {
          console.error('Failed to fetch user data', error);
          toast.error('Failed to fetch user data');
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdate = async () => {
    try {
      if (user) {
        const response = await axios.put(`${api_url}/${user.id}`, userData);
        setUserData(response.data);
        toast.success('Profile update successful');
      }
    } catch (error) {
      console.error('Failed to update user data', error);
      toast.error('Failed to update user data');
    }
  };

  const handleAddressUpdate = () => {
    if (user) {
      saveAddressToCookies(user.id, address);
      toast.success('Address updated successfully');
    }
  };

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <Heading>Profile Page</Heading>
      {user && (
        <ProfileInfo>
          <InfoText>Name: {userData.name}</InfoText>
          <InfoText>Email: {userData.email}</InfoText>
          <Button onClick={handleLogout}>Logout</Button>

          <FormGroup>
            <Input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              placeholder="Update name"
            />
            <Input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              placeholder="Update email"
            />
            <Button onClick={handleUpdate}>Update Profile</Button>
          </FormGroup>

          <FormGroup>
            <Input
              type="text"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              placeholder="Update address name"
            />
            <Input
              type="text"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
              placeholder="Update pincode"
            />
            <Input
              type="text"
              value={address.phoneNumber}
              onChange={(e) =>
                setAddress({ ...address, phoneNumber: e.target.value })
              }
              placeholder="Update phone number"
            />
            <Input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="Update city"
            />
            <Input
              type="text"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              placeholder="Update state"
            />
            <Button onClick={handleAddressUpdate}>Update Address</Button>
          </FormGroup>
        </ProfileInfo>
      )}
    </Container>
  );
};

export default ProfilePage;
