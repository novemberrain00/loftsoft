import { FC, FormEvent, useState } from "react";
import { postData } from "../../services/services";

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

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        await postData('/user/password/drop', resetData);
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
                    <span className="input__label">Пароль</span>
                    <input onInput={(e: any) => setResetData({
                        ...resetData,
                        password: (e.target as HTMLInputElement).value
                    })} type="password" className="input__text" placeholder="Пароль" id="reset-password" required/>
                </label>
                <input type="submit" className="btn auth__form-btn" value="Сбросить пароль"/>
            </form>
        </>
    );
}
 
export default PasswordResetForm;