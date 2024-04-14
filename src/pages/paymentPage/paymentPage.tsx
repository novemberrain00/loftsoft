import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import RootPage from "../rootPage/rootPage";

import SBPImg from '../../assets/images/icons/sbp_large.svg';
import { getData, postData } from "../../services/services";

import { RootState } from "../../store";
import { addSnack } from "../../redux/snackbarSlice";
import './paymentPage.scss';


interface PaymentPagePropsI {
}
 
const PaymentPage: FC<PaymentPagePropsI> = () => {
    const [data, setData] = useState({
        phone: '',
        seller: '',
    });
    const [seconds, setSeconds] = useState<number>(600);
    const [isInstructionOpened, setIsInstructionOpened] = useState<boolean>(false);

    const {id} = useParams();
    const navigate = useNavigate();
    const orderPrice = useSelector((state: RootState) => state.order.price);
    const replenishment = useSelector((state: RootState) => state.replenishment);
    const dispatch = useDispatch();

    let totalPrice = replenishment.replenishment.result_price || orderPrice;

    document.title = "Оплата";

    const checkOrder = async () => {
        const route = replenishment.replenishment.number.length ? `/user/balance/replenish/${replenishment.replenishment.number}` : `/order/${id}/check`
        await getData(route, true)
        .then(data => {
            if(data?.status?.includes("waiting")) {
                dispatch(addSnack({text: "Ожидается оплата"}));
                return;
            }

            if(replenishment.replenishment.number.length > 0) {
                navigate('/');
            } else {
                navigate('success');
            }
        });
    }

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const remainingSeconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            } else {
                clearInterval(interval);
                
                postData(`/order/${id}/cancel`, {}, true)
                .then(() => {
                    navigate(-1);
                })
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    useEffect(() => {
        getData('/payments/sbp/ozon/user', true)
        .then(data => setData({
            phone: data.phone,
            seller: data.fio
        }));

        const route = replenishment.replenishment.number.length ? `/user/balance/replenish/${replenishment.replenishment.number}` : `/order/${id}/check`
        getData(route, true)
        .then(data => {
            if(!totalPrice) {
                totalPrice = data.result_price
            }

            setSeconds(data.remaining_time)
        })
    }, []);

    console.log(seconds)    

    return (
        <RootPage>
            <div className="container content__container">
                {
                !isInstructionOpened ? <div className="payment">
                    <header className="payment__header">
                        <div className="payment__header-top">
                            <div className="payment__header-left">
                                <div className="payment__header-info">
                                    <h1 className="payment__header-title">Сумма к переводу:</h1>
                                    {totalPrice} ₽
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
                        <label htmlFor="payment-phone" className="input payment__input">
                            <span className="input__label">Номер телефона</span>
                            <input 
                                readOnly
                                value={data.phone}
                                type="text" 
                                className="payment__input-text input__text input__text_rounded" 
                                placeholder="Номер телефона" 
                                id="payment-phone"
                            />
                        </label>
                        <label htmlFor="payment-bank" className="input payment__input">
                            <span className="input__label">Банк получателя</span>
                            <input 
                                readOnly 
                                value="Озон Банк" 
                                type="text" 
                                className="payment__input-text input__text input__text_rounded" 
                                placeholder="Банк получателя" 
                                id="payment-bank"
                            />
                        </label>
                        <label htmlFor="payment-seller" className="input payment__input">
                            <span className="input__label">Инициалы получателя</span>
                            <input 
                                readOnly
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
                                        <span className="instruction__step-attention">{data.phone}</span>(Озон Банк)
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