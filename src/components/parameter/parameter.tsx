import { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../store";
import { postData } from "../../services/services";
import { setUserInfo } from "../../redux/userSlice";

import BlueCartIcon from "../../assets/images/icons/cart_blue.svg";

import './parameter.scss';
import { setOrder } from "../../redux/straightOrderSlice";

interface ParameterPropsI {
    id: number
    productId: number
    title: string
    salePrice: number
    price: number
    hasSale: boolean
    salePercent: string | null,
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
    const [isSwitchOpened, setIsSwitchOpened] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(0);
    const [isDataPosted, setIsDataPosted] = useState<boolean>(true);

    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const straightOrder = useSelector((state: RootState) => state.straightOrder.straightOrder);
    const dispatch = useDispatch();

    const postToCart = async () => {
        setIsDataPosted(false)
        if(!window.localStorage.getItem('access_token')) {
            await postData('/user/register', {
                username: `user-${Math.random().toString(36).substring(2, 14)}`
            })
            .then(data => {
                if(data.access_token) {
                    window.localStorage.setItem('access_token', data.access_token);
                    postToCart();
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
        if(quantity > 0) {
            setIsSwitchOpened(true);
        } else {
            setIsSwitchOpened(false);
            return
        }

        postToCart();

    }, [quantity])

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
            <div className={`product-page__switch ${!isSwitchOpened ? 'product-page__switch_hidden' : ''}`}>
                <button className="product-page__switch-btn" disabled={!isDataPosted} onClick={() => {
                    setQuantity(quantity-1)
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="3" viewBox="0 0 12 3" fill="none">
                        <path d="M11 1.64258L1 1.64258" stroke="#3F3F3F" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <span className="product-page__switch-counter">{quantity}</span>
                <button className="product-page__switch-btn" disabled={!isDataPosted} onClick={() => {
                    setQuantity(quantity+1)
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
            <a onClick={(e) => {
                e.preventDefault();
                setQuantity(quantity+1);
            }} href="#" className="link product-page__var-cart">
                <img src={BlueCartIcon} alt="в корзину" />
            </a>
        </div>
    </div>
    )
        
}
 
export default Parameter;