import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout';
import MainPage from '@/pages/MainPage';
import SigninPage from '@/features/auth/signin/SigninPage';
import SignUp from '@/features/auth/signup/SignUp';
import SupportChatPage from '@/pages/SupportChatPage';
import ProtectedRoute from '@/shared/protectedRoute';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { refreshThunk } from '@/entities/user/model/thunks';

export default function AppRoutes(): React.JSX.Element {
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(refreshThunk());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute isAllowed={isLogin} redirectTo="/signin">
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route element={<ProtectedRoute isAllowed={!isLogin} redirectTo="/" />}>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<ProtectedRoute isAllowed={isLogin} redirectTo="/signin" />}>
          <Route path="/support" element={<SupportChatPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
