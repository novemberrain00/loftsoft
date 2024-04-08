import { FC, MouseEvent, useEffect } from "react";
import { useSelector } from 'react-redux';

import SearchIcon from '../../assets/images/icons/search_grey.svg';
import CartIcon from '../../assets/images/icons/cart_grey.svg';
import ChatIcon from '../../assets/images/icons/chat_grey.svg';
import MobileMenuIcon from '../../assets/images/icons/mobile-menu-icon.svg';
import AccountIcon from '../../assets/images/icons/account.svg';

import { RootState } from "../../store";
import { Link } from "react-router-dom";

import './mobileMenu.scss';

interface MobileMenuPropsI {
    chatOpener: React.Dispatch<React.SetStateAction<boolean>>
    profileOpener: React.Dispatch<React.SetStateAction<boolean>>
    menuOpener: React.Dispatch<React.SetStateAction<boolean>>
    isDropdownOpened: boolean
}
 
const MobileMenu: FC<MobileMenuPropsI> = ({ chatOpener, profileOpener, menuOpener, isDropdownOpened }) => {
    const userPhoto = useSelector((state: RootState) => state.user.userInfo.photo)
    const userCartQuantity = useSelector((state: RootState) => state.user.userInfo.shop_cart.length)

    return (
        <nav className="menu">
            <ul className="list menu__list">
                <li className="menu__list-item">
                    <a href="#" className="menu__list-link">
                        <img src={SearchIcon} className="menu__list-icon" alt="поиск" />
                    </a>
                </li>
                <li className="menu__list-item menu__list-cart">
                    <Link to="/profile/cart">
                        <a href="#" className="menu__list-link">
                            <span className="menu__list-quantity">{userCartQuantity}</span>
                            <img src={CartIcon} className="menu__list-icon" alt="корзина" />
                        </a>
                    </Link>
                </li>
                <li className="menu__list-item menu__list-item_main">
                    <a href="#" onClick={(e: MouseEvent) => {
                        e.preventDefault()
                        menuOpener(!isDropdownOpened)
                    }} className="menu__list-link">
                        <img src={MobileMenuIcon} className="menu__list-opener" alt="закрыть меню" />
                    </a>
                </li>
                <li className="menu__list-item">
                    <a href="#" onClick={(e: MouseEvent) => {
                        e.preventDefault()
                        chatOpener(true)
                    }} className="menu__list-link">
                        <img src={ChatIcon} className="menu__list-icon" alt="чат" />
                    </a>
                </li>
                {
                    window.localStorage.getItem('access_token') ? (
                        <li onClick={() => {
                            document.body.style.overflowX = 'hidden';
                            document.body.style.height = '100vh';
                            profileOpener(true)
                        }} className="menu__list-item">
                            <a href="#" className="menu__list-link">
                                <img src={userPhoto} className="menu__list-icon menu__list-avatar" alt="профиль" />
                            </a>
                        </li>
                    ) : (
                        <li className="menu__list-item">
                            <Link to="/auth">
                                <a href="#" className="menu__list-link">
                                    <img src={AccountIcon} className="menu__list-icon menu__list-avatar" alt="профиль" />
                                </a>
                            </Link>
                        </li>
                    )
                }
                
            </ul>
        </nav>
    );
}
 
export default MobileMenu;