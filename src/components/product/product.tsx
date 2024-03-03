import {FC} from 'react';
import { useNavigate } from 'react-router-dom';

import CartIcon from '../../assets/images/icons/cart_small.svg';

import './product.scss';

interface ProductPropsI {
    id: number,
    name: string,
    imgPath: string,
    descr: string,
    priceOld: string,
    priceNew: string,
    discount: number
    url: string
}
 
const Product: FC<ProductPropsI> = ({id, name, imgPath, descr, priceOld, priceNew, discount, url}) => {
    const navigate = useNavigate();

    return (
        <div className="block product">
            <img src={imgPath} alt={name} className="product__img" />
            <div className="product__content">
                <h4 className="title product__title">{name}</h4>
                <p className="text text_small product__descr">
                    {descr}
                </p>
                <div className="product__bottom">
                    <button onClick={() => navigate(url)} className="product__btn btn btn_grey">
                        Подробнее
                        <img src={CartIcon} alt="в корзину" className="product__btn-icon" />
                    </button>
                    <div className="product__price">
                        <span className="product__price-old">{+priceNew ? priceOld + '₽' : ''}</span>
                        <div className="product__price-new">{+priceNew ? priceNew : priceOld}</div>
                    </div>
                    {+priceNew ? <div className="discount-value product__discount-value">-{discount}%</div> : ''}
                </div>
            </div>
        </div>
    );
}
 
export default Product;