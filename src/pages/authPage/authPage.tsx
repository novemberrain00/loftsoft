import { FC, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import LoginForm from "../../components/loginForm/loginForm";
import SnackbarContainer from "../../components/snackbar/snackbar";

import Logo from '../../assets/images/logo/logo.svg';
import ArrowLeft from '../../assets/images/icons/arrow-left_black.svg';
import RegIcon from '../../assets/images/icons/reg.svg';

import RegForm from "../../components/regForm/regForm";
import { SnackI } from "../../interfaces";
import Snack from "../../components/snack/snack";

import './authPage.scss';
import { RootState } from "../../store";

interface AuthPagePropsI {
    
}
 
const AuthPage: FC<AuthPagePropsI> = () => {
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState(false); //false - authorization, true - registration
    const snacks = useSelector((state: RootState) => state.snackbar.snacksArr);

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
                        <a href="#" className="link auth__btn" onClick={() => navigate(-1)}>
                            <img src={ArrowLeft} alt="Назад" className="auth__btn-icon" />
                            Назад
                        </a>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setActiveForm(!activeForm);
                        }} className="link auth__btn">
                            <img src={RegIcon} alt="Регистрация" className="auth__btn-icon" />
                            {!activeForm ? "Регистрация" : "Вход"}
                        </a>
                    </div>
                    <div className="auth__support">
                        <a href="#" className="link auth__support-link">Забыли пароль?</a>
                        <a href="#" className="link auth__support-link">Сообщить о проблеме</a>
                        <a href="#" className="link auth__support-link">О LoftSoft</a>
                    </div>
                </div>
                <div className="auth__right">
                    {!activeForm ? <LoginForm/> : <RegForm changeForm={setActiveForm}/>}
                </div>
            </div>
        </div>
    );
}
 
export default AuthPage;