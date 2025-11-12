import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout';
import { useAppDispatch, useAppSelector } from '@/shared/api/hooks';
import MainPage from '@/pages/main-page/MainPage';
import AboutPage from '@/pages/about/AboutPage';
import ContactsPage from '@/pages/contacts/ContactsPage';
import AuthPage from '@/pages/Auth/AuthPage';
import ProtectedRoute from '@/shared/lib/ProtectedRoute';
import { refresh } from '@/entities/regs/thunks/thunks';
import OrderHistoryPage from '@/pages/order-history/OrderHistoryPage';
import SupportChatPage from '@/pages/support-chat/SupportChatPage';

export default function AppRouter(): React.JSX.Element {
  const userStatus = useAppSelector((store) => store.auth.status);

  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(refresh());
  }, [dispatch]);

  if (userStatus === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route element={<ProtectedRoute isAllowed={userStatus !== 'logged'} redirectTo="/" />}>
          <Route path="/auth" element={<AuthPage />} />
        </Route>
        <Route element={<ProtectedRoute isAllowed={userStatus === 'logged'} redirectTo="/auth" />}>
          <Route path="/history" element={<OrderHistoryPage />} />
          <Route path="/support" element={<SupportChatPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
