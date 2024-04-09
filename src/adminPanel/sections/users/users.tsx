import { FC, useEffect, useState } from "react";
import { useSelector } from 'react-redux';

import AdminHeader from "../../../components/adminHeader/adminHeader";

import RefreshIcon from "../../../assets/images/icons/refresh.svg";
import SearchIcon from "../../../assets/images/icons/search.svg";
import TrashIcon from "../../../assets/images/icons/trash.svg";
import StarsIcon from "../../../assets/images/icons/stars.svg";
import PenIcon from "../../../assets/images/icons/pen.svg";

import { UserI } from "../../../interfaces";

import { RootState } from "../../../store";
import { deleteData, getCookie, getData } from "../../../services/services";
import Popup from "../../../components/categoryPopup/categoryPopup";

import './users.scss';

interface UsersPropsI {
    
}

interface UserUpdatedDataI {
    username?: string,
    balance: number,
    password?: string,
    is_admin: boolean
}
 
const Users: FC<UsersPropsI> = () => {
    const curUser = useSelector((state: RootState) => state.user.userInfo);
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const [usersList, setUsersList] = useState<UserI[]>([]);
    const [editPopup, setEditPopup] = useState<'password' | 'login' | 'balance' | ''>('');
    const [editingUserId, setEditingUserId] = useState<number>(-1);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [userInitialData, setUserInitialData] = useState({
        id: -1,
        username: '',
        password: '',
        balance: ''
    });
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        balance: ''
    });

    useEffect(() => {
        getData('/users', true)
        .then(data => setUsersList(data));
    }, []);

    const updateUser = async () => {
        let data: UserUpdatedDataI = userData.username === userInitialData.username ? {
            balance: +userData.balance,
            is_admin: false
        } : {
            username: userData.username,
            balance: +userData.balance,
            is_admin: false
        }

        data = userData.password.length ? {
            ...data,
            password: userData.password,
        } : data;

        await fetch(baseURL + `/user/${userInitialData.id}`, {
            method: 'PATCH',
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + window.localStorage.getItem('access_token') as string,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(async () => {
            await getData('/users', true)
            .then(data => setUsersList(data));

            setUserInitialData({
                id: -1,
                username: '',
                balance: '',
                password: ''
            });

            setUserData({
                username: '',
                balance: '',
                password: ''
            });
            setEditPopup('');
        })
    }

    const deleteUser = async (id: number) => {
        await deleteData(`/user/${id}`).then(data => {
            setUsersList(data)
        })
    }

    return (
        <>
            <AdminHeader title="Пользователи">
                <button className="btn admin__btn" onClick={() => window.location.reload()}>
                    <img src={RefreshIcon} alt="Обновить" />
                    Обновить
                </button>
            </AdminHeader>
            <Popup isPopupOpened={editPopup !== ''} setIsPopupOpened={() => setEditPopup('')}>
                {
                    editPopup === 'balance'  && <>
                        <h3 className="title popup__title">Установить баланс <br /> пользователя <b>{userInitialData.username}</b></h3>
                        <div className="popup__body">
                            <label htmlFor="balance-3406" className="input popup__input">
                                <span className="input__label">Изменить баланс</span>
                                <input 
                                    onInput={(e) => setUserData({...userData, balance: (e.target as HTMLInputElement).value})}
                                    value={userData.balance}
                                    placeholder="Баланс" 
                                    id="balance-3406" 
                                    type="text" 
                                    className="input__text" 
                                />
                            </label>
                            <span className="popup__note">Текущий баланс: {userInitialData.balance}</span>
                            <button 
                                onClick={() => updateUser()}
                                className="btn popup__btn"
                            >
                                Применить
                            </button>
                        </div>
                    </>
                }
                {
                    editPopup === 'password'  && <>
                        <h3 className="title popup__title">Установить пароль <br /> пользователя <b>{userInitialData.username}</b></h3>
                        <div className="popup__body">
                            <label htmlFor="password-3406" className="input popup__input">
                                <span className="input__label">Изменить пароль</span>
                                <input 
                                    onInput={(e) => setUserData({...userData, password: (e.target as HTMLInputElement).value})}
                                    value={userData.password}
                                    placeholder="Пароль" 
                                    id="password-3406" 
                                    type="text" 
                                    className="input__text" 
                                />
                            </label>
                            <button 
                                className="btn popup__btn"
                                style={{marginTop: '40px'}}
                                onClick={() => updateUser()}
                            >
                                Применить
                            </button>
                        </div>
                    </>
                }
                {
                    editPopup === 'login'  && <>
                        <h3 className="title popup__title">Установить логин <br /> пользователя <b>{userInitialData.username}</b></h3>
                        <div className="popup__body">
                            <label htmlFor="login-3406" className="input popup__input">
                                <span className="input__label">Изменить логин</span>
                                <input 
                                    onInput={(e) => setUserData({...userData, username: (e.target as HTMLInputElement).value})}
                                    value={userData.username}
                                    placeholder="Логин" 
                                    id="login-3406" 
                                    type="text" 
                                    className="input__text" 
                                />
                            </label>
                            <span className="popup__note">Текущий логин: {userInitialData.username}</span>
                            <button 
                                className="btn popup__btn"
                                onClick={() => updateUser()}
                            >
                                Применить
                            </button>
                        </div>
                    </>
                }
                <div className="popup__notification">
                    Используйте с осторожностью
                </div>
            </Popup>
            <div className="admin__block users">
                <div className="users__header">
                    <div className="search subcategories__search">
                        <img src={SearchIcon} alt="поиск" className="search__icon subcategories__search-icon"/>
                        <input type="text" placeholder="Поиск" className="search__input" />
                    </div>
                </div>
                <ul className="list users__list">
                    {
                        usersList && usersList.map(({id, username, email, is_active, is_admin, balance, photo}) => {
                            return is_admin ? null : (
                                <li className="users__list-item user">
                                    <img src={baseURL + '/uploads/' + photo} alt="" className="user__avatar" />
                                    <div className="user__info">
                                        <h5 className="user__name">{email}</h5>
                                        <div className="user__info-bottom">
                                            <div className="user__char user__char_active">{is_active ? 'Активен' : 'Не активен'}</div>
                                            <div className="user__char">Баланс: {balance} руб.</div>
                                        </div>
                                    </div>
                                    <div className="user__helpers">
                                        <button 
                                            onClick={() => {
                                                setUserInitialData({
                                                    id: id as number,
                                                    username,
                                                    balance,
                                                    password: ''
                                                });

                                                setUserData({
                                                    username,
                                                    balance,
                                                    password: ''
                                                });
                                                setEditPopup('password');
                                            }} 
                                            className="user__helper"
                                        >
                                            <img src={StarsIcon} alt="редактировать" className="user__helper-icon" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setUserInitialData({
                                                    id: id as number,
                                                    username,
                                                    balance,
                                                    password: ''
                                                });

                                                setUserData({
                                                    username,
                                                    balance,
                                                    password: ''
                                                });
                                                setEditPopup('login')
                                            }} 
                                            className="user__helper"
                                        >
                                            <img src={PenIcon} alt="редактировать" className="user__helper-icon" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setUserInitialData({
                                                    id: id as number,
                                                    username,
                                                    balance,
                                                    password: ''
                                                });

                                                setUserData({
                                                    username,
                                                    balance,
                                                    password: ''
                                                });
                                                setEditPopup('balance');
                                            }} 
                                            className="user__helper"
                                        >
                                            ₽
                                        </button>
                                        <button className="user__helper" onClick={() => deleteUser(id as number)}>
                                            <img src={TrashIcon} alt="удалить" className="user__helper-icon" />
                                        </button>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    );
}
 
export default Users;