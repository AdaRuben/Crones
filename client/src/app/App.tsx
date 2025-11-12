import { Provider } from 'react-redux';
import { store } from './store/store';

// import MapPage from '../pages/MainPage/MainPage';
import React from 'react';
// import AuthPage from '@/pages/Auth/AuthPage';


import { BrowserRouter } from 'react-router';
import AppRouter from './routes/AppRouter';


export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      {/* <MapPage /> */}
      {/* <AuthPage /> */}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>

    </Provider>
  );
}
