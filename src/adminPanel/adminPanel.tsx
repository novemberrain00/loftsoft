import { FC, ReactNode, useEffect, useState, MouseEvent } from "react";
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
import Notifications from "./sections/notifications/notifications";

interface AdminPanelPropsI {
    children: ReactNode
}
 
const AdminPanel: FC<AdminPanelPropsI> = ({children}) => {
    const [isNotificationsOpened, setIsNotificationsOpened] = useState<boolean>(false);

    const dispatch = useDispatch();
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;
    const isSidebarOpened = useSelector((state: RootState) => state.adminSidebar.isOpened);
    const snacks = useSelector((state: RootState) => state.snackbar.snacksArr);
    const isAdmin = useSelector((state: RootState) => state.user.userInfo.is_admin);

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

        if(window.localStorage.getItem('access_token')) getUserData();
    }, [])

    return isAdmin ? (
        <>
        <Notifications isPopupOpened={isNotificationsOpened} setIsPopupOpened={setIsNotificationsOpened}/>
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
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin">
                                <a href="/" className="admin__menu-link">Главная страница</a>
                            </Link>
                        </li>
                    </ul>
                    <h3 className="admin__sidebar-subtitle">Управление</h3>
                    <ul className="list admin__menu">
                        <li className="admin__menu-item">
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/users">
                                <a href="/" className="admin__menu-link">Пользователи</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/products">
                                <a href="/" className="admin__menu-link">Товары</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/reviews">
                                <a href="/" className="admin__menu-link">Отзывы</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/categories">
                                <a href="/" className="admin__menu-link">Категории</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/subcategories">
                                <a href="/" className="admin__menu-link">Подкатегории</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/promocodes">
                                <a href="/" className="admin__menu-link">Промокоды</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/billing">
                                <a href="/" className="admin__menu-link">Платежная система</a>
                            </Link>
                        </li>
                    </ul>
                    <h3 className="admin__sidebar-subtitle">Чаты</h3>
                    <ul className="list admin__menu">
                        <li className="admin__menu-item">
                            <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/tickets">
                                <a href="/" className="admin__menu-link">Начало работы</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                        <Link onClick={() => {
                                dispatch(closeSidebar())
                            }} to="/admin/tickets/history">
                                <a href="/" className="admin__menu-link">История</a>
                            </Link>
                        </li>
                        <li className="admin__menu-item">
                            <a onClick={(e: MouseEvent) => {
                                e.preventDefault();
                                setIsNotificationsOpened(true)
                            }} href="/" className="admin__menu-link">Уведомления</a>
                        </li>
                    </ul>
                </nav>
                <Link to="/">
                    <a href="/" className="admin__logout">
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
        </>
    ) : null;
}
 
export default AdminPanel;