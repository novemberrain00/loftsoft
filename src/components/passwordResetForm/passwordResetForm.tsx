import { FC, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";

import { postData } from "../../services/services";
import { addSnack } from "../../redux/snackbarSlice";

interface PasswordResetFormPropsI {
    
}

interface LoginDataI {
    email: string
    password: string
}
 
const PasswordResetForm: FC<PasswordResetFormPropsI> = () => {
    const [resetData, setResetData] = useState<LoginDataI>({
        email: '',
        password: ''
    });
    const [status, setStatus] = useState<'done' | 'processing'>('done');

    const dispatch = useDispatch();

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        setStatus('processing')
        await postData('/user/password/drop', resetData)
        .then(() => {
            dispatch(addSnack({text: 'Ссылка для сброса пароля отправлена на почту'}))
        })
        .finally(() => setStatus('done'));
    }

    return (
        <>
            <h1 className="auth__title title">Сброс пароля</h1>
            <form onSubmit={(e) => submitHandler(e)} action="post" className="auth__form">
                <label htmlFor="reset-email" className="input">
                    <span className="input__label">Почта</span>
                    <input onInput={(e: any) => setResetData({
                        ...resetData,
                        email: (e.target as HTMLInputElement).value
                    })} type="email" className="input__text" placeholder="Логин" id="reset-email" required/>
                </label>
                <label htmlFor="reset-password" className="input">
                    <span className="input__label">Новый пароль</span>
                    <input onInput={(e: any) => setResetData({
                        ...resetData,
                        password: (e.target as HTMLInputElement).value
                    })} type="password" className="input__text" placeholder="Пароль" id="reset-password" required/>
                </label>
                <input type="submit" disabled={status === 'processing'} className="btn auth__form-btn" value="Сбросить пароль"/>
            </form>
        </>
    );
}
 
export default PasswordResetForm;