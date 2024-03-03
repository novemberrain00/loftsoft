import { FC } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import BackIcon from "../../../assets/images/icons/back.svg";
import CloseIcon from "../../../assets/images/icons/close_blue.svg";
import CloseTicketIcon from "../../../assets/images/icons/close.svg";
import UpdateIcon from "../../../assets/images/icons/update_blue.svg";
import TgIcon from "../../../assets/images/icons/tg_blue.svg";
import TrashIcon from "../../../assets/images/icons/trash.svg";
import Avatar from "../../../assets/images/img/ava.png";

import './start.scss';

interface StartPropsI {
    
}
 
const Start: FC<StartPropsI> = () => {
    return (
        <>
            <AdminHeader title="Начало работы"></AdminHeader>
            <div className="start">
                <div className="start__top">
                    <div className="start__top-item">
                        <img src={BackIcon} alt="Перейти к последнему тикету" />
                        Перейти к последнему тикету
                    </div>
                    <div className="start__top-item">
                        <img src={CloseIcon} alt="Закрыть все чаты" />
                        Закрыть все чаты
                    </div>
                    <div className="start__top-item">
                        <img src={UpdateIcon} alt="История закрытых тикетов" />
                        История закрытых тикетов
                    </div>
                    <div className="start__top-item">
                        <img src={TgIcon} alt="Настроить уведомления Telegram" />
                        Настроить уведомления Telegram
                    </div>
                </div>
                <div className="start__tickets tickets">
                    <h2 className="tickets__title">
                        Открытые тикеты
                        <div className="tickets__helper">
                            <img src={TrashIcon} alt="удалить" />
                        </div>
                    </h2>
                    <div className="tickets__items">
                        <div className="tickets__item ticket">
                            <input type="checkbox" className="checkbox" id="checkbox-21"/>
                            <label htmlFor="checkbox-21" className="checkbox-label"></label>
                            <div className="ticket__body">
                                <img src={Avatar} alt="" className="ticket__img" />
                                <div className="ticket__info">
                                    <span className="ticket__num">Ticket#12</span>
                                    <h4 className="ticket__name">Nickname</h4>
                                </div>
                                <div className="ticket__message">
                                    <h6 className="ticket__message-title">
                                        Последнее сообщение
                                    </h6>
                                    “я не могу ввести код, у меня тут какая то ошибка
                                    я не могу ввести код, у меня тут какая то ошибка
                                    я не могу ввести код, у меня тут какая то ошибка"
                                </div>
                                <img src={CloseTicketIcon} alt="закрыть" className="ticket__closer" />
                            </div>
                        </div>
                        <div className="tickets-item ticket">
                            <input type="checkbox" className="checkbox" id="checkbox-22"/>
                            <label htmlFor="checkbox-22" className="checkbox-label"></label>
                            <div className="ticket__body">
                                <img src={Avatar} alt="" className="ticket__img" />
                                <div className="ticket__info">
                                    <span className="ticket__num">Ticket#12</span>
                                    <h4 className="ticket__name">Nickname</h4>
                                </div>
                                <div className="ticket__message">
                                    <h6 className="ticket__message-title">
                                        Последнее сообщение
                                    </h6>
                                    “я не могу ввести код, у меня тут какая то ошибка
                                    я не могу ввести код, у меня тут какая то ошибка
                                    я не могу ввести код, у меня тут какая то ошибка"
                                </div>
                                <img src={CloseTicketIcon} alt="закрыть" className="ticket__closer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Start;