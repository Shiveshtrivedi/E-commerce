import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { IPrivateRouteProps } from '../utils/interface/Interface';

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ element }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
