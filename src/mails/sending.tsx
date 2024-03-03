import { FC } from "react";

import MailsRoot from "../components/mailsRoot/mailsRoot";

import ClockIcon from '../assets/images/icons/clock.svg';
import ProductImg from '../assets/images/img/mails/product.png';

interface SendingMailsPropsI {
    
}
 
const SendingMail: FC<SendingMailsPropsI> = () => {
    return (
        <MailsRoot title='Спасибо за покупку!' subtitle="Ваш товар скоро будет доставлен">
            <table className="sending mail__container">
                <tr>
                    <td>
                        <img src={ClockIcon} alt="ожидайте" className="sending__icon" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <h2 className="sending__title">Пожалуйста, подождите. <br /> Мы отправляем ваш товар:</h2>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="sending__products">
                            <div className="sending__product">
                                <img src={ProductImg} alt='WINDOWS 11 PRO OEM КЛЮЧ' className="sending__product-img" />
                                <div className="sending__product-info">
                                    <h4 className="sending__product-title">WINDOWS 11 PRO OEM КЛЮЧ</h4>
                                    <span className="sending__product-char">Кол-во: 4</span>
                                    <span className="sending__product-char">Стоимость: 5000 ₽</span>
                                    <span className="sending__product-total">Итого: 20000 ₽</span>
                                </div>
                            </div>
                            <div className="sending__product">
                                <img src={ProductImg} alt='WINDOWS 11 PRO OEM КЛЮЧ' className="sending__product-img" />
                                <div className="sending__product-info">
                                    <h4 className="sending__product-title">WINDOWS 11 PRO OEM КЛЮЧ</h4>
                                    <span className="sending__product-char">Кол-во: 4</span>
                                    <span className="sending__product-char">Стоимость: 5000 ₽</span>
                                    <span className="sending__product-total">Итого: 20000 ₽</span>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </MailsRoot>
    );
}
 
export default SendingMail;