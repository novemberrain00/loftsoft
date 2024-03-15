import { FC, ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LogoImg from  '../assets/images/logo/logo.svg';
import LogoutIcon from '../assets/images/icons/logout.svg';

import { getCookie, getData } from "../services/services";
import { setUserInfo } from "../redux/userSlice";

import { RootState } from "../store";
import { closeSidebar } from "../redux/adminSidebarSlice";

import SnackbarContainer from "../components/snackbar/snackbar";
import Snack from "../components/snack/snack";

import { SnackI } from "../interfaces";
import './adminPanel.scss';

interface AdminPanelPropsI {
    children: ReactNode
}
 
const AdminPanel: FC<AdminPanelPropsI> = ({children}) => {
    const dispatch = useDispatch();
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;
    const isSidebarOpened = useSelector((state: RootState) => state.adminSidebar.isOpened);
    const snacks = useSelector((state: RootState) => state.snackbar.snacksArr);

    useEffect(() => {
        const getUserData = async () => {
            await getData('/user/me', true)
                .then(data => {
                    dispatch(setUserInfo({
                        ...data,
                        photo: baseURL+'/uploads/'+data.photo
                    }));
                })

        }

        if(getCookie('access_token')) getUserData();
    }, [])

    return getCookie('is_admin') === 'true' ? (
        <div className="admin">
            <aside className={`admin__sidebar ${isSidebarOpened ? 'admin__sidebar_opened' : ''}`}>
                <div onClick={() => dispatch(closeSidebar())} className="mobile-flex admin__sidebar-closer-wrapper">
                    <div className="admin__sidebar-closer"></div>
                </div>
                <div className="admin__sidebar-heading">
                    <img src={LogoImg} alt="loftsoft" className="logo" />
                    Админ-панель
                </div>
                <nav className="admin__sidebar-nav">
                    <h3 className="admin__sidebar-subtitle">Главная</h3>
                    <ul className="list admin__menu">
                        <li className="admin__menu-item">
                            <Link to="/admin">
                                <a href="#" className="admin__menu-link admin__menu-link_active">Главная страница</a>
                            </Link>
                        </li>
                    </ul>
                    <h3 className="admin__sidebar-subtitle">Управление</h3>
                    <ul className="list admin__menu">
                        <li className="admin__menu-item">
                            <Link to="/admin/users">
                                <a href="#" className="admin__menu-link">Пользователи</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link to="/admin/products">
                                <a href="#" className="admin__menu-link">Товары</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link to="/admin/reviews">
                                <a href="#" className="admin__menu-link">Отзывы</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link to="/admin/categories">
                                <a href="#" className="admin__menu-link">Категории</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link to="/admin/subcategories">
                                <a href="#" className="admin__menu-link">Подкатегории</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link to="/admin/promocodes">
                                <a href="#" className="admin__menu-link">Промокоды</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link to="/admin/billing">
                                <a href="#" className="admin__menu-link">Платежная система</a>
                            </Link>
                        </li>
                    </ul>
                    <h3 className="admin__sidebar-subtitle">Чаты</h3>
                    <ul className="list admin__menu">
                        <li className="admin__menu-item">
                            <Link to="/admin/tickets">
                                <a href="#" className="admin__menu-link">Начало работы</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <a href="#" className="admin__menu-link">История</a>
                        </li>
                        <li className="admin__menu-item">
                            <a href="#" className="admin__menu-link">Уведомления</a>
                        </li>
                        <li className="admin__menu-item">
                            <a href="#" className="admin__menu-link">Ticket#12</a>
                        </li>
                        <li className="admin__menu-item">
                            <a href="#" className="admin__menu-link">Ticket#13</a>
                        </li>
                    </ul>
                </nav>
                <Link to="/">
                    <a href="#" className="admin__logout">
                        <img src={LogoutIcon} alt="Выйти"/>
                        Выйти
                    </a>
                </Link>
                
            </aside>
            <div className="admin__container">
                {children}
            </div>
            <SnackbarContainer>
                {
                    snacks.map(({text}:SnackI, i:number) => <Snack text={text} key={i+''}/>)
                }
            </SnackbarContainer>
        </div>
    ) : null;
}
 
export default AdminPanel;