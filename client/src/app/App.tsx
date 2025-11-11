import { Provider } from 'react-redux';
import { store } from './store/store';
import React from 'react';
import { BrowserRouter } from 'react-router';
import AppRouter from './routes/AppRouter';

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}
