import Router from '../router/router';
import ContextProvider from '../../context';

import './App.scss';

function App() {
  

  return (
    <ContextProvider>
      <Router/>
    </ContextProvider>
  );
}

export default App;
