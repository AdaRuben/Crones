import React from 'react';
import { Route, Routes } from 'react-router';
import Layout from '../Layout';
// import { useAppDispatch, useAppSelector } from '@/shared/api/hooks';
import MainPage from '@/pages/MainPage/MainPage';
import AboutPage from '@/pages/about/AboutPage';
import ContactsPage from '@/pages/contacts/ContactsPage';
import AuthPage from '@/pages/Auth/AuthPage';
// import ProtectedRoute from '@/shared/lib/ProtectedRoute';

export default function AppRouter(): React.JSX.Element {
  // const userStatus = useAppSelector((store) => store.user.status);

  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   void dispatch(refreshThunk());
  // }, []);

  // if (userStatus === 'loading') {
  //   return <div>Loading...</div>;
  // }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        {/* <Route element={<ProtectedRoute isAllowed={userStatus !== 'logged'} redirectTo="/" />}> */}
        <Route path="/signin" element={<AuthPage />} />
        {/* </Route> */}
        {/* <Route element={<ProtectedRoute isAllowed={userStatus === 'logged'} redirectTo="/" />}> */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        {/* </Route> */}
      </Route>
    </Routes>
  );
}
