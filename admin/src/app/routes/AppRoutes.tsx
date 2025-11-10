import SigninPage from '@/features/auth/signin/SigninPage';
import SignUp from '@/features/auth/signup/SignUp';
import MainPage from '@/pages/MainPage';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import ProtectedRoute from '@/shared/protectedRoute';
import { refreshThunk } from '@/entities/user/model/thunks';


export default function AppRoutes(): React.JSX.Element {
  const user = useAppSelector(state => state.user.isLogin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(refreshThunk());
  }, [dispatch]);

  return (
     <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route element={<ProtectedRoute isAllowed={!user} redirectTo="/" />}>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignUp />} />
        </Route>
      </Route>
    </Routes>
  );
}