import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../store";
import { postData } from "../../services/services";
import { setUserInfo } from "../../redux/userSlice";

import BlueCartIcon from "../../assets/images/icons/cart_blue.svg";

import { setOrder } from "../../redux/straightOrderSlice";
import { Link } from "react-router-dom";

import './parameter.scss';

interface ParameterPropsI {
    id: number
    productId: number
    title: string
    salePrice: number
    price: number
    hasSale: boolean
    salePercent: string | null
    description: string
    buyPopupOpener: React.Dispatch<React.SetStateAction<boolean>>
}
 
const Parameter: FC<ParameterPropsI> = ({
        id, 
        productId, 
        title, 
        salePrice, 
        price, 
        hasSale, 
        salePercent, 
        description, 
        buyPopupOpener
    }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [isDataPosted, setIsDataPosted] = useState<boolean>(true);

    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const straightOrder = useSelector((state: RootState) => state.straightOrder.straightOrder);
    const dispatch = useDispatch();

    const postToCart = async (quantity: number) => {
        setIsDataPosted(false)
        if(!window.localStorage.getItem('access_token')) {
            await postData('/user/register', {
                username: `user-${Math.random().toString(36).substring(2, 14)}`
            })
            .then(data => {
                if(data.access_token) {
                    window.localStorage.setItem('access_token', data.access_token);
                    postToCart(quantity);
                } 
            })
        }
        
        await postData('/cart/add', {
            product_id: productId,
            parameter_id: id,
            count: quantity
          }, true)
          .then(data => {
            setIsDataPosted(true)
            dispatch(setUserInfo({
                ...userInfo,
                shop_cart: data.shop_cart
            }))
          })
    } 

    useEffect(() => {
        const curQuantity = userInfo.shop_cart.filter(par => par.parameter.id === id)[0]?.quantity || 1
        setQuantity(curQuantity)
    }, []);

    return (
    <div className="product-page__var block">
        <h5 className="product-page__var-title title">{title}</h5>
        <div className="product-page__var-descr">
            {description}
        </div>
        <div className="product-page__bottom">
            <span className="product-page__price">{+salePrice || +price}₽</span>
            {hasSale && <span className="product-page__price product-page__price_old">{+price}₽</span>}
            {hasSale && <span className="product-page__discount-value discount-value">-{salePercent}%</span>}
            <div className="product-page__switch">
                <button 
                    className={`product-page__switch-btn ${quantity === 1 ? 'product-page__switch-btn_disabled' : ''}`} 
                    disabled={!isDataPosted} 
                    onClick={() => {
                        if(quantity > 1) { 
                            const newQuantity = quantity-1;
                            setQuantity(newQuantity)    
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="3" viewBox="0 0 12 3" fill="none">
                        <path d="M11 1.64258L1 1.64258" stroke={quantity > 0 ? 'white' : 'black'} stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <input 
                    type="text" 
                    className="product-page__switch-counter" 
                    value={quantity} 
                    onInput={(e) => {
                        const newQuantity = +(e.target as HTMLInputElement).value || 1;
                        setQuantity(newQuantity)
                        
                    }}
                />
                <button className="product-page__switch-btn" disabled={!isDataPosted} onClick={() => {
                    const newQuantity = quantity+1;
                    setQuantity(newQuantity)   
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1L6 10.2857" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M11 5.64258L1 5.64258" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <button 
                disabled={!isDataPosted} 
                onClick={() => {
                    dispatch(setOrder({
                        ...straightOrder,
                        parameter_id: id,
                        price: +salePrice || +price,
                        count: 1
                    }));
                    buyPopupOpener(true);
                }} 
                className="btn product-page__btn"
            >Приобрести</button>
            <span onClick={() => postToCart(quantity)} className="link product-page__var-cart ">
                <img src={BlueCartIcon} alt="в корзину" />
            </span>
        </div>
    </div>
    )
        
}
 
export default Parameter;