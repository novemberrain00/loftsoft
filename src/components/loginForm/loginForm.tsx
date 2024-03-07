import { FC, useState, FormEvent } from "react";
import { getData, postData } from "../../services/services";
import { useDispatch } from "react-redux";
import { addSnack } from "../../redux/snackbarSlice";
import { useNavigate } from "react-router-dom";
import { LoginResponseI } from "../../interfaces";

interface LoginFormPropsI {
   
}

interface LoginDataI {
    email: string
    password: string
}
 
const LoginForm: FC<LoginFormPropsI> = () => {
    const [loginData, setLoginData] = useState<LoginDataI>({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();

        await postData('/user/login', loginData)
        .then(async (data: LoginResponseI) => {
            if(data.detail === 'Incorrect password') {
                dispatch(addSnack({text: 'Неверный логин или пароль'}));
                return;
            } else if(data.detail === 'User not found') {
                dispatch(addSnack({text: 'Пользователь с таким email не найден'}));
                return;
            };

            document.cookie = `access_token=${data.access_token}`;
            document.cookie = `refresh_token=${data.refresh_token}`;

            navigate('/');

        })
        .catch(err => console.log(err));
    }

    return (
        <>
            <h1 className="auth__title title">Вход</h1>
            <form onSubmit={(e) => submitHandler(e)} action="post" className="auth__form">
                <label htmlFor="auth-email" className="input">
                    <span className="input__label">Почта</span>
                    <input onInput={(e: any) => setLoginData({
                        ...loginData,
                        email: (e.target as HTMLInputElement).value
                    })} type="email" className="input__text" placeholder="Логин" id="auth-email" required/>
                </label>
                <label htmlFor="auth-password" className="input">
                    <span className="input__label">Пароль</span>
                    <input onInput={(e: any) => setLoginData({
                        ...loginData,
                        password: (e.target as HTMLInputElement).value
                    })} type="password" className="input__text" placeholder="Пароль" id="auth-password" required/>
                </label>
                <input type="submit" className="btn auth__form-btn" value="Вход"/>
            </form>
        </>
    );
}
 
export default LoginForm;