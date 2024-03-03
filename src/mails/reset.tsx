import { FC } from "react";

import MailsRoot from "../components/mailsRoot/mailsRoot";

import ResetIcon from '../assets/images/icons/key.svg';

interface ResetMailsPropsI {
    
}
 
const ResetMail: FC<ResetMailsPropsI> = () => {
    return (
        <MailsRoot title='Спасибо за покупку!' subtitle="Ваш товар скоро будет доставлен">
            <table className="reset mail__container">
                <tr>
                    <td>
                        <img src={ResetIcon} alt="сбросить пароль" className="reset__icon" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <button className="btn mail__btn">Сбросить пароль</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p className="reset__text">Если вы не запрашивали сброс пароля, проигнорируйте это письмо</p>
                    </td>
                </tr>
            </table>
        </MailsRoot>
    );
}
 
export default ResetMail;