import { FC, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Popup from "../../../components/categoryPopup/categoryPopup";

import CloseIcon from "../../../assets/images/icons/close.svg";
import PlusIcon from "../../../assets/images/icons/plus.svg";

import { TelegramDataI } from "../../../interfaces";
import { getData, postData } from "../../../services/services";

import './notifications.scss';
import { addSnack } from "../../../redux/snackbarSlice";

interface NotificationsPropsI {
    isPopupOpened: boolean
    setIsPopupOpened:  React.Dispatch<React.SetStateAction<boolean>>
}
 
const Notifications: FC<NotificationsPropsI> = ({isPopupOpened, setIsPopupOpened}) => {
    const [settings, setSettings] = useState<TelegramDataI>({
        token: '',
        telegram_ids: []
    });

    const userIdRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const sendTestNotification = async () => {
        await postData('/telegram/settings/test', {} ,true)
    }

    const saveSettings = async () => {
        await postData('/telegram/settings', settings ,true)
        .then(data => {
            dispatch(addSnack({text: 'Данные успешно обновлены'}));
            setIsPopupOpened(false);
        })
    }

    const addUser = () => {
        let inputValue = (userIdRef.current as HTMLInputElement);

        if(+inputValue.value) {
            setSettings({
                ...settings,
                telegram_ids: [
                    ...settings.telegram_ids,
                    +inputValue.value
                ]
            });

            (userIdRef.current as HTMLInputElement).value = '';
        }
    }

    useEffect(() => {
        getData('/telegram/settings', true)
        .then((data: TelegramDataI) => setSettings(data));
    
        return () => setSettings({
            token: '',
            telegram_ids: []
        })
    }, []);

    return (
        <Popup isPopupOpened={isPopupOpened} setIsPopupOpened={setIsPopupOpened}>
            <h3 className="title popup__title">Настройка уведомлений <br /> Telegram</h3>
            <div className="popup__body">
                <div className="notifications">
                    <div className="popup__widget">
                        <h4 className="popup__widget-title">Добавьте пользователей для получения уведомлений</h4>
                        <label htmlFor="notifications-nickname" className="input popup__input">
                            <span className="input__label">Никнейм</span>
                            <input 
                                ref={userIdRef}
                                type="text" 
                                id="notifications-nickname" 
                                className="input__text popup__input-text" 
                                placeholder="Никнейм"
                            />
                        </label>
                        <button onClick={() => addUser()} className="btn admin__btn popup__widget-btn">
                            Добавить пользователя
                            <img src={PlusIcon} alt="Добавить пользователя" className="admin__btn-icon"/>
                        </button>
                        {settings.telegram_ids.length ? <ul className="list popup__users">
                            {settings.telegram_ids.map(id => {
                                return (
                                    <li key={id} className="popup__user">
                                        {id}
                                        <img onClick={() => {
                                            setSettings({
                                                ...settings,
                                                telegram_ids: [
                                                    ...settings.telegram_ids.filter(curId => curId !== id)
                                                ]
                                            })
                                        }} src={CloseIcon} alt="удалить" className="popup__user-icon"/>
                                    </li>
                                )
                            })}
                        </ul> : null}
                    </div>
                    <div className="popup__widget">
                        <h4 className="popup__widget-title">Настроить токен</h4>
                        <label htmlFor="notifications-nickname" className="input popup__input">
                            <span className="input__label">Ваш bot-token</span>
                            <input 
                                onInput={(e) => setSettings({
                                    token: (e.target as HTMLInputElement).value,
                                    telegram_ids: settings.telegram_ids
                                })}
                                value={settings.token}
                                type="text" 
                                id="notifications-nickname" 
                                className="input__text popup__input-text" 
                                placeholder="Ваш bot-token"
                            />
                        </label>
                        <a href="#" onClick={() => sendTestNotification()} className="notifications__link">Отправить тестовое уведомление</a>
                        <button onClick={() => saveSettings()} className="btn admin__btn popup__widget-btn">
                            Сохранить настройки
                        </button>
                    </div>
                </div>
            </div>
        </Popup>
    );
}
 
export default Notifications;