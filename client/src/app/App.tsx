import { Provider } from 'react-redux';
import { store } from './store/store';
import MapPage from '../pages/MainPage/MainPage';
import React from 'react';

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <MapPage />
    </Provider>
  );
}
