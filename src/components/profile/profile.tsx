import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import WalletIcon from '../../assets/images/icons/wallet.svg';
import CartIcon from '../../assets/images/icons/shopping_cart.svg';
import UpdateIcon from '../../assets/images/icons/update.svg';
import DashboartIcon from '../../assets/images/icons/dashboard.svg';
import LogoutIcon from '../../assets/images/icons/logout.svg';

import ProfileEditor from "../profileEditor/profileEditor";
import Overlay from "../overlay/overlay";

import { UserI } from "../../interfaces";
import { RootState } from "../../store";

import './profile.scss';
import { setUserInfo } from "../../redux/userSlice";

interface ProfilePropsI {
    isOpened: boolean
    data: UserI
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
    replenishOpener: React.Dispatch<React.SetStateAction<boolean>>
}
 
const Profile: FC<ProfilePropsI> = ({isOpened, data, closeHandler, replenishOpener}) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const [editingData, setEditingData] = useState('login');

    const userData = useSelector((state: RootState) => state.user.userInfo);
    const dispatch = useDispatch();

    const clickHandler = (data: string) => {
        setEditingData(data);
        setIsEditorOpened(true);
    }

    const logout = () => {
        window.localStorage.removeItem('access_token');
        dispatch(setUserInfo({
            id: null,
            balance: "0",
            email: "",
            is_active: false,
            is_admin: false,
            is_anonymous: true,
            photo: "",
            reg_datetime: "",
            shop_cart: [],
            username: ""
        }));

        closeHandler(false)
    }

    return isOpened ? (
        <Overlay closeHandler={closeHandler}>
            {!isEditorOpened && <div className="profile">
                <div className="profile__header">
                    <img src={data.photo} alt={data.username} className="profile__img" />
                    <h3 className="profile__name">{data.username}</h3>
                    <div className="profile__header-buttons">
                        <button onClick={() => clickHandler('login')} className="profile__btn">Сменить логин</button>
                        <button onClick={() => clickHandler('avatar')} className="profile__btn">Сменить аватар</button>
                    </div>
                </div>
                <div className="profile__balance">
                    <div className="profile__link profile__balance-link">
                        <img src={WalletIcon} className="profile__link-icon" alt="Баланс: 107₽"/>
                        Баланс: {userData.balance}₽
                    </div>
                    <button onClick={() => {
                        closeHandler(false)
                        replenishOpener(true);
                    }} className="profile__btn">Пополнить</button>
                </div>
                <ul className="list profile__menu">
                    <li className="profile__menu-item">
                        <Link to="/profile/cart">
                            <span className="profile__link">
                                <img src={CartIcon} alt="Моя корзина" className="profile__link-icon" />
                                Моя корзина
                                <span className="profile__link-amount">{userData.shop_cart.length}</span>
                            </span>
                        </Link>
                    </li>
                    <li className="profile__menu-item">
                        <Link to="/cart">
                            <span className="profile__link">
                                <img src={UpdateIcon} alt="История покупок" className="profile__link-icon" />
                                История покупок
                            </span>
                        </Link>
                    </li>
                    <li onClick={() => logout()} className="profile__menu-item">
                        <Link to="/">
                            <span className="profile__link profile__link_red">
                                <img src={LogoutIcon} alt="Выход" className="profile__link-icon" />
                                Выйти
                            </span>
                        </Link>
                    </li>

                   {
                    userData.is_admin && 
                        <li className="profile__menu-item">
                            <Link to="/admin">
                                <span className="profile__link">
                                    <img src={DashboartIcon} alt="Перейти в админ-панель" className="profile__link-icon" />
                                    Перейти в админ-панель
                                </span>
                            </Link>
                        </li>
                    }
                </ul>
            </div>}
            {isEditorOpened && <ProfileEditor editingData={editingData} closeHandler={closeHandler}/>}
        </Overlay>
    ): null;
}
 
export default Profile;