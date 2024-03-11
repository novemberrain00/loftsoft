import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import RootPage from "../rootPage/rootPage";

import SBPImg from '../../assets/images/icons/sbp_large.svg';
import { getData, postData } from "../../services/services";

import './paymentPage.scss';
import { RootState } from "../../store";
import { addSnack } from "../../redux/snackbarSlice";


interface PaymentPagePropsI {
    
}
 
const PaymentPage: FC<PaymentPagePropsI> = () => {
    const [data, setData] = useState({
        number: '',
        phone: '',
        bank: '',
        seller: '',
    });
    const [seconds, setSeconds] = useState<number>(+(window.localStorage.getItem('timeToPay') || 600));
    const [isInstructionOpened, setIsInstructionOpened] = useState<boolean>(false);

    const {id} = useParams();
    const navigate = useNavigate();
    const orderPrice = useSelector((state: RootState) => state.order.price);
    const dispatch = useDispatch();

    const checkOrder = async () => {
        await getData(`/order/${id}/check`, true)
        .then(data => {
            if(data.status === "waiting") {
                dispatch(addSnack({text: "Ожидается оплата"}));
                return;
            }

            navigate('success')
        });
    }

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };


    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
                window.localStorage.setItem('timeToPay', seconds+'')
            } else {
                clearInterval(interval);
                
                postData(`/order/${id}/cancel`, {}, true)
                .then(() => {
                    window.localStorage.removeItem('timneToPay')
                    navigate('/profile/cart');
                })
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    useEffect(() => {
        getData('/payments/sbp/ozon', true)
        .then(data => setData({
            number: data.token,
            phone: data.phone,
            seller: data.fio,
            bank: data.bank
        }));
    }, []);

    return (
        <RootPage>
            <div className="container content__container">
                {
                !isInstructionOpened ?<div className="payment">
                    <header className="payment__header">
                        <div className="payment__header-top">
                            <div className="payment__header-left">
                                <div className="payment__header-info">
                                    <h1 className="payment__header-title">Сумма к переводу:</h1>
                                    {orderPrice} ₽
                                </div>
                                <div className="payment__header-info">
                                    <h1 className="payment__header-title">Время на оплату счёта:</h1>
                                    {formatTime(seconds)}
                                </div>
                            </div>
                            <div className="payment__header-right">
                                <img src={SBPImg} alt="СБП" className="payment__header-img" />
                            </div>
                        </div>
                        <div className="payment__header-bottom">
                            Отправьте точную сумму, иначе операция не будет подтверждена
                        </div>
                    </header>
                    <div className="payment__body">
                        <label htmlFor="payment-number" className="input payment__input">
                            <span className="input__label">Номер пополнения</span>
                            <input 
                                value={data.number}
                                type="text" 
                                className="payment__input-text input__text input__text_rounded" 
                                placeholder="Номер пополнения" 
                                id="payment-number"
                            />
                        </label>
                        <label htmlFor="payment-phone" className="input payment__input">
                            <span className="input__label">Номер телефона</span>
                            <input 
                                value={data.phone}
                                type="text" 
                                className="payment__input-text input__text input__text_rounded" 
                                placeholder="Номер телефона" 
                                id="payment-phone"
                            />
                        </label>
                        <label htmlFor="payment-bank" className="input payment__input">
                            <span className="input__label">Банк получателя</span>
                            <input value="Озон Банк" type="text" className="payment__input-text input__text input__text_rounded" placeholder="Банк получателя" id="payment-bank"/>
                        </label>
                        <label htmlFor="payment-seller" className="input payment__input">
                            <span className="input__label">Инициалы получателя</span>
                            <input 
                                value={data.seller}
                                type="text" 
                                className="payment__input-text input__text input__text_rounded" 
                                placeholder="Инициалы получателя" 
                                id="payment-seller"
                            />
                        </label>
                    </div>
                    <div className="payment__bottom">
                        <button onClick={() => checkOrder()} className="btn payment__btn">Проверить</button>
                        <button onClick={() => setIsInstructionOpened(true)} className="btn payment__btn payment__btn_grey">Инструкция к оплате</button>
                    </div>
                </div> :

                <div className="instruction">
                    <div className="instruction__body">
                        <h1 className="instruction__title">Инструкция к оплате</h1>
                        <ol className="list instruction__steps">
                            <li className="instruction__step">
                                <div className="instruction__step-content">
                                    Войдите в своё банковское приложение
                                </div>
                            </li>
                            <li className="instruction__step">
                                <div className="instruction__step-content">
                                    Скопируйте номер телефона для перевода
                                    <div className="instruction__step-bottom">
                                        <span className="instruction__step-attention">79998455567</span>(Озон Банк)
                                    </div>
                                </div>
                            </li>
                            <li className="instruction__step">
                                <div className="instruction__step-content">
                                    В банковском приложении выберите “Перевод по СБП”
                                </div>
                            </li>
                            <li className="instruction__step">
                                <div className="instruction__step-content">
                                    Сделайте перевод точной суммы
                                    <div className="instruction__step-bottom">
                                        <span className="instruction__step-attention">525.00</span>
                                    </div>
                                </div>
                            </li> 
                            <li className="instruction__step">
                                <div className="instruction__step-content">
                                    Нажмите кнопку “Проверить”. Не закрывайте страницу до успешного подтверждения оплаты.
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div className="instruction__footer">
                        <p className="instruction__footer-warning">
                           <span>Запрещено</span>: оплачивать заявку несколькими переводами. В случае несоблюдения рекомендаций заявка будет отменена, а средства утеряны
                        </p>
                        <button onClick={() => setIsInstructionOpened(false)} className="btn instruction__btn">Закрыть</button>
                    </div>
                </div>
                }
            </div>
        </RootPage>
    );
}
 
export default PaymentPage;