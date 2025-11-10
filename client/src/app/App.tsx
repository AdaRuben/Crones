import { Provider } from 'react-redux';
import { store } from './store/store';
// import MapPage from '../pages/MainPage/MainPage';
import React from 'react';
import AuthPage from '@/pages/Auth/AuthPage';

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      {/* <MapPage /> */}
      <AuthPage />
    </Provider>
  );
}
