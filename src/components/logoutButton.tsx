import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/Store';
import Loading from './loading';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.products.status);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (status === 'loading') {
    return (
      <div>
        <p>
          <Loading />
        </p>
      </div>
    );
  }

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
