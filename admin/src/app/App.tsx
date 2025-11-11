import type { JSX } from 'react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { store } from './store/store';



function App(): JSX.Element {

  return (
     <BrowserRouter>
      <Provider store={store}>
        <AppRoutes/>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
