import { FC, useEffect, useState } from "react";

import Windows from '../../assets/images/img/history/windows.png';
import Maxon from '../../assets/images/img/history/maxon.png';
import Nanocad from '../../assets/images/img/history/nanocad.png';

import CloseIcon from '../../assets/images/icons/close.svg';
import AccountIcon from '../../assets/images/icons/account_white.svg';

import { getCookie, getData, timestampToTime } from "../../services/services";
import './history.scss';
import { OrderI, ReplenishI } from "../../interfaces";
import Overlay from "../overlay/overlay";

interface HistoryPropsI {
    isOpened: boolean
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
}
 
const History: FC<HistoryPropsI> = ({isOpened, closeHandler}) => {
    const [activeTab, setActiveTab] = useState(0);
    const [orders, setOrders] = useState<OrderI[]>([]);
    const [replenishes, setReplenishes] = useState<ReplenishI[]>([]);

    useEffect(() => {
        getData('/user/orders', true) 
        .then((data: OrderI[]) => setOrders(data));

        getData('/user/replenishes', true)
        .then((data: ReplenishI[]) => setReplenishes(data));
    }, []);

    useEffect(() => {
        if(isOpened) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        } else {
            document.body.style.overflow = 'initial';
            document.body.style.height = 'auto';
        }
    }, [isOpened])

    return isOpened ? (
        <Overlay closeHandler={closeHandler}>
            <div className="history">
                <div className="history__header">
                    <h2 className="history__title title">История заказов</h2>
                    <div className="history__tabs">
                        <span 
                            className={`link history__tabs-link ${!activeTab ? "history__tabs-link_active" : ''}`}
                            onClick={() => setActiveTab(0)}
                        >
                            Покупки
                        </span>
                        <span 
                            className={`link history__tabs-link ${activeTab ? "history__tabs-link_active" : ''}`}
                            onClick={() => setActiveTab(1)}
                        >
                            Пополнения
                        </span>
                    </div>
                    <div onClick={() => {
                        document.body.style.overflow = 'initial';
                        document.querySelector('.overlay')?.classList.add('overlay_disappeared')
                        setTimeout(()=> closeHandler(false), 300)
                    }} className="history__closer">
                        <img src={CloseIcon} alt="Закрыть"/>
                    </div>
                </div>
                <div className="history__lists">
                    {!window.localStorage.getItem('access_token') ? <div className="history__auth">
                        <h3 className="title history__auth-title">Авторизируйтесь</h3>
                        <h4 className="history__auth-subtitle text">для получения списка купленных продуктов и истории пополнения</h4>
                        <button className="btn history__auth-btn">
                            <img src={AccountIcon} alt="Авторизируйтесь" />
                            Авторизация
                        </button>
                    </div>: ''}
                    <ul className={`list history__items ${!window.localStorage.getItem('access_token') && 'history__items_blured'} ${!activeTab  ? "history__items_active" : ''}`}>
                        {
                            orders.length ? orders.map((order) => {

                                return order.order_parameters.map(({id, parameter, count}) => {
                                    const {title} = parameter;
                                    return (
                                        <li key={id} className="history__item">
                                            <img src={Windows} alt="Windows 10 Профессиональная" className="history__item-img" />
                                            <div className="history__item-info">
                                                <h3 className="history__item-title title">{title}</h3>
                                                <span className="history__item-char">Код товара: 13</span>
                                                <span className="history__item-char">Кол-во: {count}</span>
                                            </div>
                                            <span className="history__item-date">{timestampToTime(order.created_datetime)}</span>
                                        </li>
                                    )
                                })
                            }) : null
                        }
                    </ul>
                    <ul className={`list history__items ${!window.localStorage.getItem('access_token') && 'history__items_blured'} ${activeTab  ? "history__items_active" : ''}`}>
                        {window.localStorage.getItem('access_token') ? 

                            replenishes.length ? replenishes.map(({id, result_price, payment_type, status, created_datetime}) => {
                                return (
                                    <li key={id} className="history__item">
                                        <div className="history__item-info">
                                            <h3 className="history__item-title history__item-title_blue title">{result_price} ₽</h3>
                                            <span className="history__item-char">ID: {id}</span>
                                            <span className="history__item-char">Метод: {payment_type}</span>
                                        </div>
                                        <span className="history__item-date">{timestampToTime(created_datetime)}</span>
                                    </li>
                                )
                            }) : null

                        : ''}
                    </ul>
                </div>
            </div>
        </Overlay>
    ): null;
}
 
export default History;