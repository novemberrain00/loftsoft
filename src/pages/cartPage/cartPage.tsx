import { FC, useEffect, useState } from "react";

import { useSelector, useDispatch } from 'react-redux';

import RootPage from "../rootPage/rootPage";

import TrashGreyIcon from '../../assets/images/icons/trash_grey.svg'
import DotsIcon from '../../assets/images/icons/dots-icon.svg';
import WhiteCartIcon from '../../assets/images/icons/cart_white.svg';
import RightArrow from '../../assets/images/icons/right-arrow_light.svg';
import SBPIcon from '../../assets/images/icons/sbp.svg';
import CryptoIcon from '../../assets/images/icons/cryptocurrency.svg'
import WalletIcon from '../../assets/images/icons/wallet_blue.svg';

import EmptyCartImg from '../../assets/images/img/cart/empty.jpg';

import { RootState } from "../../store";

import CartItem from "../../components/cartItem/cartItem";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../services/services";

import CheckIcon from '../../assets/images/icons/check.svg';

import { addSnack } from "../../redux/snackbarSlice";
import { setOrderId, setPrice } from "../../redux/orderPriceSlice";

import { setUserInfo } from "../../redux/userSlice";
import { OrderI } from "../../interfaces";

import './cartPage.scss';
import { setOrder } from "../../redux/straightOrderSlice";
import { setPurchase } from "../../redux/purchaseSlice";

interface CartPagePropsI {
    
}

const CartPage: FC<CartPagePropsI> = () => {
    const [activePayment, setActivePayment] = useState<'sbp' | 'crypto' | 'site_balance'>('sbp');
    const [promo, setPromo] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [salePercent, setSalePercent] = useState<number>(0);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [isPromoUsedSuccesfully, setIsPromoUsedSuccesfully] = useState<boolean>(false);
    const [isEmailEntered, setIsEmailEntered] = useState<boolean>(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userData = useSelector((state: RootState) => state.user.userInfo);
    const orderId = useSelector((state: RootState) => state.order.id);

    let productWordForm = 'товаров';
    let totalPrice = 0,
        totalAmount = 0,
        totalDiscount = 0;

    const checkPromo = async () => {
        await getData(`/promocode/${promo}/use`)
        .then(data => {
            if(data.detail === "NOT_FOUND") {
                setAlertMessage('Промокод не существует');
                setPromo('')
                return
            }

            if(data.detail === "PROMO_INACTIVE") {
                setAlertMessage('Промокод неактивен');
                setPromo('')
                return
            }

            setSalePercent(data.sale_percent);

            setIsPromoUsedSuccesfully(true)
            dispatch(addSnack({
                text: 'Промокод успешно применен'
            }));
        });
    }

    const createOrder = async () => {
        if(!email.length || !email.includes('@')) {
            setIsEmailEntered(false);
            return
        }

        if(userData.shop_cart.length < 1) return;

        await postData('/order/', {
            promocode: promo,
            straight: false,
            email,
            payment_type: activePayment,
        } ,true)
        .then((data: OrderI | string) => {
            if(data === 'NOT_ENOUGH_BALANCE') {
                dispatch(addSnack({text: 'Недостаточно средств'}))
                return;
            }

            if(activePayment === 'site_balance') {
                dispatch(setPurchase(data))
                navigate(`order/${(data as OrderI).id}/success`);
                return;
            } else {
                dispatch(setOrderId((data as OrderI).id));
                dispatch(setPrice((data as OrderI).result_price));
                navigate(`order/${(data as OrderI).id}`);
            }
        });
    }

    const cleanCart = async () => {
        const promises = userData.shop_cart.map(({parameter, product}) => {
            return postData('/cart/add', {
                product_id: product.id,
                parameter_id: parameter.id,
                count: 0
            }, true);
        });
        
        Promise.all(promises)
        .then(() => {
            dispatch(setUserInfo({
                ...userData,
                shop_cart: []
            }));
        });
    }

    return (
        <RootPage>
            <main className="cart">
                <h1 className="cart__title container cart__container">Моя корзина</h1>
                <div className="container cart__container">
                    <div className="cart__order block">
                        {
                            userData.shop_cart.length ?
                            <>
                                <div className="cart__order-header">
                                    <h2 className="title cart__order-title">Ваш заказ</h2>
                                    <a onClick={(e) => {
                                        e.preventDefault();
                                        cleanCart()
                                    }} href="#" className="link cart__cleaner">
                                        Очистить корзину 
                                        <img src={TrashGreyIcon} alt="Очистить корзину" className="cart__cleaner-icon"/>
                                    </a>
                                </div>
                                <div className="cart__items">
                                    {
                                        userData.shop_cart.map(({product, parameter, quantity}, i) => {
                                            const {
                                                id,
                                                title,
                                                has_sale,
                                                price,
                                                sale_price,
                                                give_type
                                            } = parameter;

                                            totalPrice += (has_sale ? +sale_price : +price) * quantity;
                                            totalDiscount += (has_sale ? +price - +sale_price : 0) * quantity;
                                            totalAmount += quantity;

                                            if(totalAmount === 1) productWordForm = 'товар';
                                            if(totalAmount >= 2 && totalAmount <= 4) productWordForm = 'товара';
                                            if(totalAmount > 4) productWordForm = 'товаров';

                                            return (
                                                <CartItem
                                                    productId={product.id}
                                                    key={id}
                                                    id={id}
                                                    giveType={give_type}
                                                    title={title}
                                                    hasSale={has_sale}
                                                    price={price}
                                                    salePrice={sale_price}
                                                    quantity={quantity}
                                                    img={product.product_photos[0].photo}
                                                />
                                            )
                                        })
                                    }
                                
                                </div>
                            </> :
                            <>
                                <div className="cart__order-header cart__order-header_vertical">
                                    <h2 className="title cart__order-title">В корзине пока нет товаров</h2>
                                    <h3 className="cart__order-subtitle">Но вы можете добавить их из нашего каталога</h3>
                                </div>
                                <img src={EmptyCartImg} alt="В корзине пока нет товаров" className="cart__order-img" />
                            </>
                        }
                        
                    </div>
                    <aside className="cart__sidebar desktop-block block">
                        <div className="cart__widget">
                            <label htmlFor="cart-email" className="cart__widget-label">
                                Ваш E-mail:
                                <input 
                                    type="text" 
                                    id="cart-email" 
                                    onInput={(e) => {
                                        setIsEmailEntered(true);
                                        setEmail((e.target as HTMLInputElement).value);
                                    }}
                                    className={`cart__email cart__widget-input ${!isEmailEntered ? 'cart__widget-input_red' : 'gg'}`} 
                                    placeholder="Введите ваш E-mail" 
                                    required
                                />
                            </label>
                        </div>
                        <div className="cart__info">
                            <span className="cart__info-row text text_small">Ваш заказ: {totalAmount} {productWordForm}</span>
                            <span className="cart__info-row text text_small">На сумму: {totalPrice} руб.</span>
                            <span className="cart__info-row text text_small">Без учёта скидок: {totalDiscount+totalPrice} руб.</span>
                        </div>
                        <div className="cart__promocode cart__widget">
                            <label htmlFor="cart-promo" id="cart-promo-label" className="cart__widget-label cart__promo">
                                Промокод
                                {
                                isPromoUsedSuccesfully ? 
                                    <div 
                                        id="cart-promo" 
                                        className="cart__widget-input cart__widget-input_succesfull"
                                        
                                    >
                                        Промокод успешно применен
                                        <img src={CheckIcon} alt="прокод применен" className="cart__widget-icon"/>
                                    </div>:
                                    <input 
                                        onInput={(e) => {
                                            setAlertMessage('');
                                            setPromo((e.target as HTMLInputElement).value);
                                        }}
                                        value={promo}
                                        type="text" 
                                        id="cart-promo" 
                                        className={`cart__promocode cart__widget-input ${alertMessage.length > 0 ? 'cart__widget-input_red' : null}`}
                                        placeholder={alertMessage || "Введите промокод"}
                                    />
                                }
                                {
                                    promo.length && !isPromoUsedSuccesfully ? 
                                    <button onClick={() => checkPromo()} className="btn cart__widget-btn cart__promo-btn">
                                        <img src={RightArrow} alt="промокод" />
                                    </button> : null
                                }
                            </label>
                        </div>
                        <div className="cart__widget cart__payments">
                            <h5 className="cart__widget-label">Способ оплаты:</h5>
                            <div className="cart__payments-buttons">
                                <div onClick={() => setActivePayment('sbp')} className={`cart__payment ${activePayment === 'sbp' && 'cart__payment_active'}`}>
                                    <img src={SBPIcon} alt="СБП" className="cart__payment-icon" />
                                    СБП
                                </div>
                                {/* <div onClick={() => setActivePayment('crypto')} className={`cart__payment ${activePayment === 'crypto' && 'cart__payment_active'}`}>
                                    <img src={CryptoIcon} alt="Криптовалюта" className="cart__payment-icon" />
                                    Криптовалюта
                                </div> */}
                                {
                                    window.localStorage.getItem('access_token') ?
                                        <div onClick={() => setActivePayment('site_balance')} className={`cart__payment ${activePayment === 'site_balance' && 'cart__payment_active'}`}>
                                            <img src={WalletIcon} alt="Баланс на сайте" className="cart__payment-icon" />
                                            Баланс на сайте
                                        </div> : null
                                }
                            </div>
                        </div>
                        <div className="cart__sidebar-footer">
                            <span className="cart__sidebar-price">К оплате:  {totalPrice * (1 - salePercent / 100)} ₽</span>
                            <span className="cart__sidebar-discount">Сумма скидок по заказу: {totalDiscount} ₽</span>
                            {salePercent ? <span className="cart__sidebar-discount">Промокод: -{totalPrice * salePercent / 100} ₽</span> : null}
                            <button onClick={() => createOrder()} className="cart__btn cart__sidebar-btn btn">
                                <img src={WhiteCartIcon} alt="Оплатить" className="cart__btn-icon" />
                                Оплатить
                            </button>
                        </div>
                    </aside>
                    <aside className="cart__sidebar mobile-flex block">
                        <div className="cart__sidebar-footer">
                            <span className="cart__sidebar-price">К оплате: {totalPrice} ₽</span>
                            <span className="cart__sidebar-discount">Сумма скидок по заказу: {totalDiscount} ₽</span>
                            {salePercent ? <span className="cart__sidebar-discount">Промокод: -{totalPrice * salePercent / 100} ₽</span> : null}
                            <div className="cart__widget cart__payments">
                                <h5 className="cart__widget-label">Способ оплаты:</h5>
                                <div className="cart__payments-buttons">
                                    <div onClick={() => setActivePayment('sbp')} className={`cart__payment ${activePayment === 'sbp' && 'cart__payment_active'}`}>
                                        <img src={SBPIcon} alt="СБП" className="cart__payment-icon" />
                                        СБП
                                    </div>
                                    {/* <div onClick={() => setActivePayment('crypto')} className={`cart__payment ${activePayment === 'crypto' && 'cart__payment_active'}`}>
                                        <img src={CryptoIcon} alt="Криптовалюта" className="cart__payment-icon" />
                                        Криптовалюта
                                    </div> */}
                                    {
                                    window.localStorage.getItem('access_token') ?
                                        <div onClick={() => setActivePayment('site_balance')} className={`cart__payment ${activePayment === 'site_balance' && 'cart__payment_active'}`}>
                                            <img src={WalletIcon} alt="Баланс на сайте" className="cart__payment-icon" />
                                            Баланс на сайте
                                        </div> : null
                                }
                                </div>
                            </div>
                            {salePercent ? <span className="cart__sidebar-discount">Промокод: -{totalPrice * salePercent / 100} ₽</span> : null}
                            <button onClick={() => createOrder()} className="cart__btn cart__sidebar-btn btn">
                                <img src={WhiteCartIcon} alt="Оплатить" className="cart__btn-icon" />
                                Оплатить
                            </button>
                        </div>
                        <div className="cart__sidebar-right">
                            <div className="cart__widget">
                                <label htmlFor="cart-email" className="cart__widget-label">
                                    Ваш E-mail:
                                    <input 
                                    type="text" 
                                    id="cart-email" 
                                    onInput={(e) => {
                                        setIsEmailEntered(true);
                                        setEmail((e.target as HTMLInputElement).value);
                                    }}
                                    className={`cart__email cart__widget-input ${!isEmailEntered ? 'cart__widget-input_red' : 'gg'}`} 
                                    placeholder="Введите ваш E-mail" 
                                    required
                                />
                                </label>
                            </div>
                            <div className="cart__promocode cart__widget">
                            <label htmlFor="cart-promo" id="cart-promo-label" className="cart__widget-label cart__promo">
                                Промокод
                                {
                                isPromoUsedSuccesfully ? 
                                    <div 
                                        id="cart-promo" 
                                        className="cart__widget-input cart__widget-input_succesfull"
                                        
                                    >
                                        Промокод успешно применен
                                        <img src={CheckIcon} alt="прокод применен" className="cart__widget-icon"/>
                                    </div>:
                                    <input 
                                        onInput={(e) => {
                                            setAlertMessage('');
                                            setPromo((e.target as HTMLInputElement).value);
                                        }}
                                        value={promo}
                                        type="text" 
                                        id="cart-promo" 
                                        className={`cart__promocode cart__widget-input ${alertMessage.length > 0 ? 'cart__widget-input_red' : null}`}
                                        placeholder={alertMessage || "Введите промокод"}
                                    />
                                }
                                {
                                    promo.length && !isPromoUsedSuccesfully ? 
                                    <button onClick={() => checkPromo()} className="btn cart__widget-btn cart__promo-btn">
                                        <img src={RightArrow} alt="промокод" />
                                    </button> : null
                                }
                            </label>
                        </div>
                            <div className="cart__info">
                                <span className="cart__info-row text text_small">Ваш заказ: 2 {productWordForm}</span>
                                <span className="cart__info-row text text_small">На сумму: {totalPrice} руб.</span>
                                <span className="cart__info-row text text_small">Без учёта скидок: {totalPrice+totalDiscount} руб.</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </RootPage>
    );
}
 
export default CartPage;