import { FC, useEffect, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Overlay from "../overlay/overlay";

import ArrowIcon from "../../assets/images/icons/arrow_right_bold.svg";
import CartIcon from "../../assets/images/icons/cart_white.svg";
import SBPIcon from "../../assets/images/icons/sbp.svg";
import WalletIcon from "../../assets/images/icons/wallet_blue.svg";

import { RootState } from "../../store";
import { resetInputData, setOrder } from "../../redux/straightOrderSlice";
import { getData, postData } from "../../services/services";
import { OrderI, PurchaseI } from "../../interfaces";
import { setOrderId, setPrice } from "../../redux/orderPriceSlice";

import './buyPopup.scss';
import { setPurchase } from "../../redux/purchaseSlice";

interface BuyPopupPropsI {
    isOpened: boolean
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
}
 
const BuyPopup: FC<BuyPopupPropsI> = ({isOpened, closeHandler}) => {
    const [activePayment, setActivePayment] = useState<string>('Способ оплаты');
    const [isPaymentsListShowed, setIsPaymentListShowed] = useState<boolean>(false);
    const [isAgreementChecked, setIsAgreementChecked] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const straightOrder = useSelector((state: RootState) => state.straightOrder.straightOrder);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const checkPromo = async (e: any) => {
        await getData(`/promocode/${straightOrder.promocode}/use`)
        .then(data => {
            if(data.detail === "NOT_FOUND") {
                //setAlertMessage('Промокод не существует');
                
                return
            }

            // if(data.detail === "PROMO_INACTIVE") {
            //     setAlertMessage('Промокод неактивен');
            //     setPromo('')
            //     return
            // }

            //setSalePercent(data.sale_percent);

            // setIsPromoUsedSuccesfully(true)
            // dispatch(addSnack({
            //     text: 'Промокод успешно применен'
            // }));
        });
    }

    const createOrder = async (e: FormEvent) => {
        e.preventDefault();
        const {promocode, parameter_id, count, email} = straightOrder;
        
        if(email.length === 0) {
            setAlertMessage('Введите email');
            return;
        }

        if(count <= 0) {
            setAlertMessage('Введите количество товара');
            return;
        }

        if(activePayment === 'Способ оплаты') {
            setAlertMessage('Выберите способ оплаты');
            return;
        }

        await postData('/order/', {
            promocode,
            parameter_id,
            payment_type: activePayment === 'Баланс сайта' ? 'site_balance' : 'sbp',
            count,
            email,
            straight: true
        }, true)
        .then((data: PurchaseI | string) => {
            if(data === 'NOT_ENOUGH_BALANCE') {
                setAlertMessage('Недостаточно средств на балансе')
                return;
            }

            const { id, total_price} = data as PurchaseI;

            if(activePayment === 'Баланс сайта') {
                dispatch(setPurchase({...(data as PurchaseI)}));
                navigate(`/profile/cart/order/${id}/success`);
                return;
            } else {
                dispatch(setOrderId(id));
                dispatch(setPrice(total_price));

                window.localStorage.setItem('timeToPay', '600')
                navigate(`/profile/cart/order/${id}`);
            }
        });
    }

    useEffect(() => {
        if(isOpened) {
            (document.querySelector('html') as HTMLElement).style.overflowY = 'hidden';
        } else {
            (document.querySelector('html') as HTMLElement).style.height = 'auto';
            (document.querySelector('html') as HTMLElement).style.overflowY = 'initial';

            setAlertMessage('');

            dispatch(resetInputData());  
        }

        return () => {
            (document.querySelector('html') as HTMLElement).style.height = 'auto';
            (document.querySelector('html') as HTMLElement).style.overflowY = 'initial';

        }
    }, [isOpened]);


    useEffect(() => {
        setIsPaymentListShowed(false);
    }, [activePayment])

    return isOpened ?     
    (
        <Overlay closeHandler={closeHandler}>
            <div className="purchase">
                <h2 className="purchase__title">Оплата товара</h2>
                <form action="post" className="purchase__form">
                    <div className="purchase__dropdown">
                        <div onClick={() => setIsPaymentListShowed(!isPaymentsListShowed)} className="purchase__form-input purchase__dropdown-opener">
                            {activePayment}
                            <img src={ArrowIcon} style={{transform: isPaymentsListShowed ? 'rotate(90deg)': ''}} alt="открыть" className="purchase__form-icon" />
                        </div>
                        <ul 
                            className={`list purchase__dropdown-list ${isPaymentsListShowed? 'purchase__dropdown-list_opened' : null}`}
                        >
                            <li onClick={() => setActivePayment('Система быстрых платежей')} className="purchase__dropdown-item">
                                <img src={SBPIcon} alt="сбп" />
                                Система быстрых платежей
                            </li>
                            <li onClick={() => setActivePayment('Баланс сайта')} className="purchase__dropdown-item">
                                <img src={WalletIcon} alt="сбп" />
                                Баланс сайта
                            </li>
                        </ul>
                    </div>
                    <input 
                        onInput={(e) => dispatch(setOrder({
                            ...straightOrder,
                            email: (e.target as HTMLInputElement).value
                        }))} 
                        placeholder="Почта E-Mail (предпочтительно Gmail)" 
                        type="email" 
                        className="purchase__form-input"
                    />
                    <div className="purchase__form-inputs">
                        <input 
                            onInput={(e) => dispatch(setOrder({
                                ...straightOrder,
                                count: +(e.target as HTMLInputElement).value
                            }))} 
                            placeholder="Количество (мин.: 1)" 
                            type="text" 
                            className="purchase__form-input"
                        />
                        <div className="purchase__promocode">
                            <input 
                                onInput={(e) => dispatch(setOrder({
                                    ...straightOrder,
                                    promocode: (e.target as HTMLInputElement).value
                                }))} 
                                placeholder="Промокод" 
                                type="text" 
                                className="purchase__form-input"
                            />
                        </div>
                    </div>
                    <div className="purchase__form-footer">
                        <span className="purchase__form-price">К оплате: {straightOrder.price * straightOrder.count} ₽</span>
                        <span className="purchase__form-alert">{alertMessage}</span>
                        <div className="checkbox-container">
                            <input onChange={(e) => setIsAgreementChecked((e.target as HTMLInputElement).checked)} type="checkbox" className="checkbox purchase__checkbox" id="checkbox-4566"/>
                            <label htmlFor="checkbox-4566" className="purchase__checkbox-label checkbox-label">
                                Согласен с&nbsp;<Link to="/terms"><a href="#" className="purchase__link">правилами магазина</a></Link>
                            </label>
                        </div>
                        <div className="purchase__form-bottom">
                            <button onClick={(e: FormEvent) => createOrder(e)} disabled={!isAgreementChecked} className="btn purchase__btn">
                                <img src={CartIcon} alt="оплатить" className="btn__icon" />
                                Перейти к оплате
                            </button>
                            <a href="#" onClick={() => closeHandler(false)} className="purchase__link">Закрыть</a>
                        </div>
                    </div>
                </form>
            </div>
        </Overlay>
    ) : null;
}
 
export default BuyPopup;