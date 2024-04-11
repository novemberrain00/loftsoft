import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TrashIcon from '../../assets/images/icons/trash.svg';

import { postData } from "../../services/services";
import { setUserInfo } from "../../redux/userSlice";
import { RootState } from "../../store";

import './cartItem.scss';
import { Link } from "react-router-dom";

interface CartItemPropsI {
    id: number
    title: string
    hasSale: boolean
    price: string
    salePrice: string
    img: string
    quantity: number
    productId: number
    giveType: string
    subcategoryId: number
}
 
const CartItem: FC<CartItemPropsI> = ({id, title, hasSale, price, salePrice, img, quantity, productId, giveType, subcategoryId}) => {
    const [newQuantity, setNewQuantity] = useState<number>(quantity);
    const [isDataPosted, setIsDataPosted] = useState<boolean>(true);

    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const dispatch = useDispatch();

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const postToCart = async () => {
        setIsDataPosted(false);
        await postData('/cart/add', {
            product_id: productId,
            parameter_id: id,
            count: newQuantity
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
        postToCart();
    }, [newQuantity])

    return (
        <div className="cart__item">
            <div className="cart__item-header">
                <span className="cart__item-id">{'0'.repeat(3 - (''+id).length) + id}</span>
            </div>
            <div className="cart__item-footer">
                <Link to={`/catalog/${subcategoryId}/${productId}`}>
                    <div className="cart__item-img">
                        <img src={baseURL + '/uploads/' + img} alt={title}/>
                    </div>
                </Link>
                <div className="cart__item-body">
                    <Link to={`/catalog/${subcategoryId}/${productId}`}>
                        <p className="cart__item-name">
                            {title}
                        </p>
                    </Link>
                    <span className="cart__item-delivery">
                        {giveType === 'string' ? 'Ключ' : null}
                        {giveType === 'hand' ? 'Доставка на Email' : null}
                        {giveType === 'file' ? 'Файл' : null}
                    </span>
                    <div className="cart__item-bottom">
                        <div className="cart__switch">
                            <button disabled={!isDataPosted} className="cart__switch-btn" onClick={() => setNewQuantity(newQuantity-1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2" fill="none">
                                    <path d="M11 1L1 0.999999" stroke="#3F3F3F" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                            <span className="cart__switch-counter">{newQuantity}</span>
                            <button disabled={!isDataPosted} className="cart__switch-btn" onClick={() => setNewQuantity(newQuantity+1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 1L6 11" stroke="#3F3F3F" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M11 6L1 6" stroke="#3F3F3F" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <span className="cart__item-price">{+salePrice || price}₽</span>
                        {hasSale && <span className="cart__item-price cart__item-price_old">{price} ₽</span>}
                    </div>
                </div>
                <div onClick={() => setNewQuantity(0)} className="cart__item-icon">
                    <img src={TrashIcon} alt="Удалить" className="cart__item-trash" />
                </div>
            </div>
        </div>
    );
}
 
export default CartItem;