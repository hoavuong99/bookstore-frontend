/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminToken } from "../utils/auth";

const AdminRoute = ({children}) => {
  const token = localStorage.getItem('token');
  if(!isAdminToken(token)) {
    return <Navigate to="/login" replace/>
  }
  return children ?  children : <Outlet/>;
}

export default AdminRoute