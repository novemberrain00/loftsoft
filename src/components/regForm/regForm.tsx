import { FC, useState, FormEvent } from "react";
import { useDispatch } from 'react-redux';
import { addSnack } from "../../redux/snackbarSlice";
import { postData } from "../../services/services";

interface RegFormPropsI {
    changeForm:  React.Dispatch<React.SetStateAction<boolean>>
}

interface RegDataI {
    username: string
    password: string
    email: string
}
 
const RegForm: FC<RegFormPropsI> = ({changeForm}) => {
    const [regData, setRegData] = useState<RegDataI>({
        username: '',
        email: '',
        password: ''
    })

    const dispatch = useDispatch(); 

    const submitHandler = async (e:FormEvent) => {
        e.preventDefault();

        await postData('/user/register', regData)
        .then(data => {

            switch (data.detail) {
                case 'LOGIN_EXISTS': 
                    dispatch(addSnack({text: 'Пользователь с таким именем уже зарегестрирован'}));
                    return;
                case 'EMAIL_EXISTS':
                    dispatch(addSnack({text: 'Пользователь с таким email уже зарегестрирован'}));
                    return;
            }

            dispatch(addSnack({text: 'Вы успешно зарегестрировались'}));
            changeForm(false);

        })
        .catch(err => console.log(err));
    }

    return (
        <>
            <h1 className="auth__title title">Регистрация</h1>
            <form onSubmit={e => submitHandler(e)} action="post" className="auth__form">
                <label htmlFor="auth-login" className="auth__form-label">
                    <span className="auth__form-input-name">Логин</span>
                    <input onInput={(e: any) => setRegData({
                        ...regData,
                        username: (e.target as HTMLInputElement).value
                    })} type="text" className="auth__form-input" placeholder="Логин" id="auth-login" required/>
                </label>
                <label htmlFor="auth-email" className="auth__form-label">
                    <span className="auth__form-input-name">Почта</span>
                    <input onInput={(e: any) => setRegData({
                        ...regData,
                        email: (e.target as HTMLInputElement).value
                    })} type="email" className="auth__form-input" placeholder="Почта" id="auth-email" required/>
                </label>
                <label htmlFor="auth-password" className="auth__form-label">
                    <span className="auth__form-input-name">Пароль</span>
                    <input onInput={(e: any) => setRegData({
                        ...regData,
                        password: (e.target as HTMLInputElement).value
                    })} type="password" className="auth__form-input" placeholder="Пароль" id="auth-password" required/>
                </label>
                
                <input type="submit" className="btn auth__form-btn" value="Зарегестрироваться"/>
            </form>
        </>
    );
}
 
export default RegForm;