import { FC, MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import RegForm from "../../components/regForm/regForm";
import LoginForm from "../../components/loginForm/loginForm";
import SnackbarContainer from "../../components/snackbar/snackbar";
import Snack from "../../components/snack/snack";

import Logo from '../../assets/images/logo/logo.svg';
import ArrowLeft from '../../assets/images/icons/arrow-left_black.svg';
import RegIcon from '../../assets/images/icons/reg.svg';
import LoginIcon from '../../assets/images/icons/login.svg';

import { SnackI } from "../../interfaces";
import { RootState } from "../../store";

import './authPage.scss';
import PasswordResetForm from "../../components/passwordResetForm/passwordResetForm";

interface AuthPagePropsI {
    
}
 
const AuthPage: FC<AuthPagePropsI> = () => {
    const navigate = useNavigate();
    const snacks = useSelector((state: RootState) => state.snackbar.snacksArr);
    
    const [activeForm, setActiveForm] = useState<'register' | 'login' | 'reset'>('login');

    return (
        <div className="auth">
            <SnackbarContainer>
                {
                    snacks.map(({text}:SnackI, i:number) => <Snack text={text} key={i+''}/>)
                }
            </SnackbarContainer>
            <div className="auth__block">
                <div className="auth__left">
                    <img src={Logo} alt="loftsoft" className="logo auth__logo" />
                    <div className="auth__buttons">
                        <a 
                            href="#" 
                            className="link auth__btn" 
                            onClick={() => {
                                activeForm === 'reset' ? setActiveForm('register') : navigate(-1)
                            }}
                        >
                            <img src={activeForm === 'reset' ? RegIcon : ArrowLeft} alt="Назад" className="auth__btn-icon" />
                            {activeForm === 'reset' ? 'Регистрация' : 'Назад'}
                        </a>
                        <a href="/" onClick={(e) => {
                            e.preventDefault();
                            setActiveForm(activeForm === 'login' ? "register" : "login");
                        }} className="link auth__btn">
                            <img src={activeForm !== 'login'  ?  LoginIcon : RegIcon} alt="Регистрация" className="auth__btn-icon" />
                            {activeForm === 'login' ? "Регистрация" : "Вход"}
                        </a>
                    </div>
                    <div className="auth__support">
                        <a href="/" onClick={(e: MouseEvent) => {
                            e.preventDefault()
                            setActiveForm('reset')
                        }} className="link auth__support-link">Забыли пароль?</a>
                    </div>
                </div>
                <div className="auth__right">
                    {activeForm === 'login' && <LoginForm/>}
                    {activeForm === 'register' && <RegForm changeForm={setActiveForm}/>}
                    {activeForm === 'reset' && <PasswordResetForm/>}
                </div>
            </div>
        </div>
    );
}
 
export default AuthPage;