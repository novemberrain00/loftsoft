import { FC, MouseEvent, useState } from "react";
import { useSelector } from 'react-redux';

import CartIcon from '../../assets/images/icons/cart_grey.svg';
import ChatIcon from '../../assets/images/icons/chat_grey.svg';
import HistoryIcon from '../../assets/images/icons/update_grey.svg';
import MobileMenuIcon from '../../assets/images/icons/mobile-menu-icon.svg';
import AccountIcon from '../../assets/images/icons/account.svg';

import { RootState } from "../../store";
import { Link } from "react-router-dom";

import './mobileMenu.scss';
import Profile from "../profile/profile";

interface MobileMenuPropsI {
    historyOpener: React.Dispatch<React.SetStateAction<boolean>>
    profileOpener: React.Dispatch<React.SetStateAction<boolean>>
    menuOpener: React.Dispatch<React.SetStateAction<boolean>>
    chatOpener: React.Dispatch<React.SetStateAction<boolean>>
    replenishOpener: React.Dispatch<React.SetStateAction<boolean>>
    isDropdownOpened: boolean
}
 
const MobileMenu: FC<MobileMenuPropsI> = ({ 
        historyOpener, 
        profileOpener, 
        chatOpener, 
        menuOpener, 
        replenishOpener, 
        isDropdownOpened,
    }) => {
        
    const userData = useSelector((state: RootState) => state.user.userInfo);
    const userCart= useSelector((state: RootState) => state.user.userInfo.shop_cart);

    const [isProfileOpened, setIsProfileOpened] = useState(false);

    return (
        <>
            {
                isProfileOpened &&
                    <Profile
                        isOpened={isProfileOpened}
                        historyOpener={historyOpener}
                        data={userData} 
                        replenishOpener={replenishOpener} 
                        closeHandler={setIsProfileOpened}
                    />
            }
            <nav className="menu">
                <ul className="list menu__list">
                    <li className="menu__list-item">
                        <a href="#" onClick={(e: MouseEvent) => {
                            e.preventDefault()
                            historyOpener(true)
                        }} className="menu__list-link">
                            <img src={HistoryIcon} className="menu__list-icon" alt="история покупок" />
                        </a>
                    </li>
                    <li className="menu__list-item menu__list-cart">
                        <Link to="/profile/cart">
                            <span className="menu__list-link">
                                <span className="menu__list-quantity">{userCart.reduce((acc, cur) => acc + cur.quantity, 0)}</span>
                                <img src={CartIcon} className="menu__list-icon" alt="корзина" />
                            </span>
                        </Link>
                    </li>
                    <li className="menu__list-item menu__list-item_main">
                        <span onClick={(e: MouseEvent) => {
                            e.preventDefault()
                            menuOpener(!isDropdownOpened)
                        }} className="menu__list-link">
                            <img src={MobileMenuIcon} className="menu__list-opener" alt="закрыть меню" />
                        </span>
                    </li>
                    <li className="menu__list-item">
                        <span  onClick={(e: MouseEvent) => {
                            e.preventDefault()
                            chatOpener(true)
                        }} className="menu__list-link">
                            <img src={ChatIcon} className="menu__list-icon" alt="чат" />
                        </span>
                    </li>
                    {
                        window.localStorage.getItem('access_token') ? (
                            <li onClick={() => {
                                if(!isProfileOpened) {
                                    setIsProfileOpened(true)
                                } else {
                                    const profileElement = document.querySelector('.profile');
                                    profileElement?.classList.add('profile_disappeared')

                                    setTimeout(() => setIsProfileOpened(false), 600)
                                }
                            }
                            } className="menu__list-item menu__profile-trigger">
                                <span className="menu__list-link">
                                    <img src={userData.photo} className="menu__list-icon menu__list-avatar" alt="профиль" />
                                </span>
                            </li>
                        ) : (
                            <li className="menu__list-item">
                                <Link to="/auth">
                                    <span className="menu__list-link">
                                        <img src={AccountIcon} className="menu__list-icon menu__list-avatar" alt="профиль" />
                                    </span>
                                </Link>
                            </li>
                        )
                    }
                    
                </ul>
            </nav>
        </>  
    );
}
 
export default MobileMenu;