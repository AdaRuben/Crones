import type { JSX } from 'react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { App as AntdApp } from 'antd';
import AppRoutes from './routes/AppRoutes';
import { store } from './store/store';



function App(): JSX.Element {

  return (
     <BrowserRouter>
      <Provider store={store}>
        <AntdApp>
          <AppRoutes/>
        </AntdApp>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
