import { FC } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import SearchIcon from "../../../assets/images/icons/search.svg";
import RefreshIcon from "../../../assets/images/icons/refresh.svg";
import PlusIcon from "../../../assets/images/icons/plus.svg";
import OptionsIcon from "../../../assets/images/icons/options_bold.svg";
import TrashIcon from "../../../assets/images/icons/trash.svg";

import "./promocodes.scss";

interface PromocodesPropsI {
    
}
 
const Promocodes: FC<PromocodesPropsI> = () => {
    return (
        <>
            <AdminHeader title="Промокоды">
            <button className="btn admin__btn" onClick={() => window.location.reload()}>
                    <img src={RefreshIcon} alt="Обновить" />
                    Обновить
                </button>
            </AdminHeader>
            <div className="promocodes admin__block">
                <div className="promocodes__header">
                    <label htmlFor="promocodes__search-input" className="promocodes__search">
                        <img src={SearchIcon} alt="поиск" className="promocodes__search-icon" />
                        <input type="text" id="promocodes__search-input" placeholder="Поиск" className="promocodes__search-input"/>
                    </label>
                    <button className="btn admin__btn">
                        <img src={PlusIcon} alt="Создать промокод" className="admin__btn-icon" />
                        Создать промокод
                    </button>
                </div>
                <div className="promocodes__items">
                    <div className="promocodes__items-header">
                        <span className="promocodes__text">Промокод</span>
                        <span className="promocodes__text">Процент скидки</span>
                        <span className="promocodes__text">Информация</span>
                        <span className="promocodes__text">Действия</span>
                    </div>
                    <div className="promocodes__item">
                        <span className="promocodes__text promocodes__text_bold">FREE15</span>
                        <span className="promocodes__text">15%</span>
                        <span className="promocodes__text">
                            Количество использований: неограничено <br />Активировано: 256 раз
                        </span>
                        <div className="promocodes__item-helpers">
                            <div className="promocodes__item-helper">
                                <img src={OptionsIcon} alt="настроить" className="promocodes__helper-icon" />
                            </div>
                            <div className="promocodes__item-helper">
                                <img src={TrashIcon} alt="удалить" className="promocodes__helper-icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Promocodes;