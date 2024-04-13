import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import BackIcon from "../../../assets/images/icons/back.svg";
import CloseIcon from "../../../assets/images/icons/close_blue.svg";
import CloseTicketIcon from "../../../assets/images/icons/close.svg";
import UpdateIcon from "../../../assets/images/icons/update_blue.svg";
import TrashIcon from "../../../assets/images/icons/trash.svg";

import { SupportTicketI } from "../../../interfaces";
import './start.scss';
import { getData, postData } from "../../../services/services";
import { Link } from "react-router-dom";

interface StartPropsI {
    
}
 
const Start: FC<StartPropsI> = () => {
    const [tickets, setTickets] = useState<SupportTicketI[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<number[]>([]);

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const closeTicket = async (e: MouseEvent, id: number) => {
        e.preventDefault();
        await postData(`/ticket/${id}/close`, {}, true)
        .then(() => setTickets(tickets.filter(ticket => ticket.id !== id)))
    }

    useEffect(() => {
        getData('/tickets/opened', true)
        .then((data: SupportTicketI[]) => setTickets(data));
    }, [])

    return (
        <>
            <AdminHeader title="Начало работы"></AdminHeader>
            <div className="start">
                <div className="start__top">
                    <div onClick={(e: MouseEvent) => {
                        tickets.forEach(({id}) => {
                            closeTicket(e, id)
                            setTickets([])
                        })
                    }} className="start__top-item">
                        <img src={CloseIcon} alt="Закрыть все чаты" />
                        Закрыть все чаты
                    </div>
                    <Link to="history">
                        <div className="start__top-item">
                            <img src={UpdateIcon} alt="История закрытых тикетов" />
                            История закрытых тикетов
                        </div>
                    </Link>
                </div>
                <div className="start__tickets tickets">
                    <h2 className="tickets__title">
                        Открытые тикеты
                        <div onClick={(e: MouseEvent) => {
                            selectedTickets.forEach(ticketId => {
                                closeTicket(e, ticketId)
                            })

                            setSelectedTickets([])
                        }} className="tickets__helper">
                            <img src={TrashIcon} alt="удалить" />
                        </div>
                    </h2>
                    <div className="tickets__items">
                        {
                            tickets.length ? tickets.map(({id, last_message, user}) => {
                                return (
                                    <div className="tickets__item ticket">
                                        <input onChange={(e: ChangeEvent) => {
                                            setSelectedTickets(
                                                (e.target as HTMLInputElement).checked ? 
                                                    [...selectedTickets, id] : selectedTickets.filter(ticketId => ticketId !== id)
                                            )
                                        }} 
                                            type="checkbox" 
                                            className="checkbox" 
                                            id={`checkbox-${id}`}
                                        />
                                        <label htmlFor={`checkbox-${id}`} className="checkbox-label"></label>
                                        <div className="ticket__body">
                                            <img src={baseURL + '/uploads/' + user.photo} alt="" className="ticket__img" />
                                            <div className="ticket__info">
                                                <Link to={`${id}`}>
                                                    <span className="ticket__num">Ticket#{id}</span>
                                                </Link>
                                                <h4 className="ticket__name">{user.username}</h4>
                                            </div>
                                            <div className="ticket__message">
                                                <h6 className="ticket__message-title">
                                                    Последнее сообщение
                                                </h6>
                                                “{last_message}"
                                            </div>
                                            <img onClick={(e: MouseEvent) => closeTicket(e, id)} src={CloseTicketIcon} alt="закрыть" className="ticket__closer" />
                                        </div>
                                    </div>
                                )
                            }) : null
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Start;