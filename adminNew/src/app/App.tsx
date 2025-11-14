import type { JSX } from 'react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { App as AntApp } from 'antd';
import AppRoutes from './routes/AppRoutes';
import { store } from './store/store';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AntApp>
          <AppRoutes />
        </AntApp>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
