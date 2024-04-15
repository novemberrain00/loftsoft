import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import Router from '../router/router';
import ContextProvider from '../../context';

import { getData } from '../../services/services';
import { setUserInfo } from '../../redux/userSlice';

import './App.scss';
import { UserI } from '../../interfaces';

function App() {
  const dispatch = useDispatch();
  const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

  console.log('render')

  useEffect(() => {
    const getUserData = async () => {
      await getData('/user/me', true)
          .then((data: UserI) => {
              dispatch(setUserInfo({
                  ...data,
                  photo: baseURL+'/uploads/'+data.photo
              }));

              document.cookie = `is_admin=${data.is_admin}`;
          })
    }

    if(window.localStorage.getItem('access_token')) getUserData();  
  }, [])

  return (
    <ContextProvider>
      <Router/>
    </ContextProvider>
  );
}

export default App;
