import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import WalletIcon from '../../assets/images/icons/wallet.svg';
import CartIcon from '../../assets/images/icons/shopping_cart.svg';
import UpdateIcon from '../../assets/images/icons/update.svg';
import DashboartIcon from '../../assets/images/icons/dashboard.svg';
import LogoutIcon from '../../assets/images/icons/logout-profile.svg';

import { UserI } from "../../interfaces";
import { RootState } from "../../store";

import { setUserInfo } from "../../redux/userSlice";
import ProfileEditor from "../profileEditor/profileEditor";

import './profile.scss';

interface ProfilePropsI {
    data: UserI
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
    replenishOpener: React.Dispatch<React.SetStateAction<boolean>>
    historyOpener: React.Dispatch<React.SetStateAction<boolean>>
}
 
const Profile: FC<ProfilePropsI> = ({data, closeHandler, replenishOpener, historyOpener}) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const [editingData, setEditingData] = useState('login');

    const userData = useSelector((state: RootState) => state.user.userInfo);
    const dispatch = useDispatch();

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

    const closeProfile = () => {
        const profileElement = document.querySelector('.profile');
        profileElement?.classList.add('profile_disappeared')

        if(isEditorOpened) { 
            setTimeout(() => {
                closeHandler(false);
            }, 600)
        }
    }

    const clickHandler = (data: string) => {
        setEditingData(data);
        setIsEditorOpened(true);
        closeProfile()
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const profileElement = document.querySelector('.profile');
            const headerProfileElement = document.querySelector('.header__profile');

            if (
                profileElement && 
                headerProfileElement && 
                !profileElement.contains(event.target as Node) && 
                !headerProfileElement.contains(event.target as Node) &&
                event.target !== headerProfileElement
            ) {
                closeProfile()
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('scroll', () => {
            closeProfile()
        });

        return () => {
            document.removeEventListener('click', handleClickOutside);

            document.removeEventListener('scroll', () => {
                closeProfile()
            });
        };
    }, []);


    return  (
        <>
            <div className="profile">
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
                                <span className="profile__link-amount">{userData.shop_cart.reduce((item, cur) => item + cur.quantity, 0)}</span>
                            </span>
                        </Link>
                    </li>
                    <li className="profile__menu-item">
                        <span onClick={() => {
                            closeHandler(false);
                            historyOpener(true);
                        }} className="profile__link">
                            <img src={UpdateIcon} alt="История покупок" className="profile__link-icon" />
                            История покупок
                        </span>
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
                        <li onClick={() => closeHandler(false)} className="profile__menu-item">
                            <Link to="/admin">
                                <span className="profile__link">
                                    <img src={DashboartIcon} alt="Перейти в админ-панель" className="profile__link-icon" />
                                    Перейти в админ-панель
                                </span>
                            </Link>
                        </li>
                    }
                </ul>
            </div> 
            <ProfileEditor isOpened={isEditorOpened} closeHandler={closeHandler} editingData={editingData}/>
        </>
    );
}
 
export default Profile;