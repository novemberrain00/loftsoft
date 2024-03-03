import React from 'react';

import MainPage from '../../pages/mainPage/mainPage';
import CatalogPage from '../../pages/catalogPage/catalogPage';

import './App.scss';
import Router from '../router/router';
import { getData } from '../../services/services';

function App() {
  return (
    <Router/>
  );
}

export default App;
