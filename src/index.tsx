import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/app/App';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

//document.designMode = 'on';

root.render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
);
