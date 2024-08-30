import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { IAdminRouteProps } from '../utils/interface/Interface';

const AdminRoute: React.FC<IAdminRouteProps> = ({ element }) => {
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  return isAdmin ? element : <Navigate to="/login" />;
};

export default AdminRoute;
