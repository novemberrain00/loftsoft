import { FC, useState } from "react";

import Windows from '../../assets/images/img/history/windows.png';
import Maxon from '../../assets/images/img/history/maxon.png';
import Nanocad from '../../assets/images/img/history/nanocad.png';

import CloseIcon from '../../assets/images/icons/close.svg';
import AccountIcon from '../../assets/images/icons/account_white.svg';

import './history.scss';
import { getCookie } from "../../services/services";

interface HistoryPropsI {
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
    
}
 
const History: FC<HistoryPropsI> = ({closeHandler}) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
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
                        closeHandler(false)
                    }} className="history__closer">
                        <img src={CloseIcon} alt="Закрыть"/>
                    </div>
                </div>
                <div className="history__lists">
                    {!getCookie('access_token') ? <div className="history__auth">
                        <h3 className="title history__auth-title">Авторизируйтесь</h3>
                        <h4 className="history__auth-subtitle text">для получения списка купленных продуктов и истории пополнения</h4>
                        <button className="btn history__auth-btn">
                            <img src={AccountIcon} alt="Авторизируйтесь" />
                            Авторизация
                        </button>
                    </div>: ''}
                    <ul className={`list history__items ${!getCookie('access_token') && 'history__items_blured'} ${!activeTab  ? "history__items_active" : ''}`}>
                        <li className="history__item">
                            <img src={Windows} alt="Windows 10 Профессиональная" className="history__item-img" />
                            <div className="history__item-info">
                                <h3 className="history__item-title title">Windows 10 Профессиональная</h3>
                                <span className="history__item-char">Код товара: 13</span>
                                <span className="history__item-char">Кол-во: 1</span>
                            </div>
                            <span className="history__item-date">25.08.2023</span>
                        </li>
                    </ul>
                    <ul className={`list history__items ${!getCookie('access_token') && 'history__items_blured'} ${activeTab  ? "history__items_active" : ''}`}>
                        {getCookie('access_token') ? <li className="history__item">
                            <div className="history__item-info">
                                <h3 className="history__item-title history__item-title_blue title">100 ₽</h3>
                                <span className="history__item-char">ID: 128q6419</span>
                                <span className="history__item-char">Метод: LAVA</span>
                            </div>
                            <span className="history__item-date">25.08.2023</span>
                        </li>: ''}
                    </ul>
                </div>
            </div>
    );
}
 
export default History;