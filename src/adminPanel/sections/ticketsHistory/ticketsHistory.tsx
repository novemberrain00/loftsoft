import { FC, useEffect, useState, MouseEvent } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import BackArrow from "../../../assets/images/icons/arrow_left.svg";
import CloseTicketIcon from "../../../assets/images/icons/close.svg";

import { Link, useNavigate } from "react-router-dom";
import { getData, postData, timestampToTime } from "../../../services/services";
import { SupportTicketI } from "../../../interfaces";

import './ticketsHistory.scss';

interface TicketsHistoryPropsI {
    
}
 
const TicketsHistory: FC<TicketsHistoryPropsI> = () => {
    const navigate = useNavigate();
    const [ticketsList, setTicketsList] = useState<SupportTicketI[]>([]);

    const closeTicket = async (e: MouseEvent, id: number) => {
        e.preventDefault();
        await postData(`/ticket/${id}/delete`, {}, true)
        .then(() => setTicketsList(ticketsList.filter(ticket => ticket.id !== id)))
    }

    useEffect(() => {
        getData('/tickets/closed', true)
        .then((data: SupportTicketI[]) => setTicketsList(data));
    }, []);

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    return (
        <>
            <AdminHeader title="История тикетов">
                <button onClick={() => navigate(-1)} className="admin__btn btn">
                    <img src={BackArrow} alt="назад"/>
                    Назад
                </button>
            </AdminHeader>
            <div className="tickets tickets-history">
                <div className="tickets__items">
                    {
                        ticketsList.length ? ticketsList.map(ticket => {
                            const {user, id, closed_at, status} = ticket;
                            
                            return (
                                <div key={id} className="tickets__item ticket">
                                    <div className="ticket__body">
                                        <img src={baseURL + '/uploads/' + user.photo} alt="" className="ticket__img" />
                                        <div className="ticket__info" onClick={() => navigate(`/admin/tickets/${id}`)}>
                                            <Link to={`${id}`}>
                                                <span className="ticket__num">
                                                    Ticket#{id} {status === 'closed' ? `(closed at ${timestampToTime(closed_at)})` : null}
                                                </span>
                                            </Link>
                                            <h4 className="ticket__name">{user.username}</h4>
                                        </div>
                                        <a href="#" onClick={(e: MouseEvent) => closeTicket(e, id)} className="ticket__delete desktop-block">удалить навсегда</a>
                                        <img onClick={(e: MouseEvent) => closeTicket(e, id)} src={CloseTicketIcon} alt="закрыть" className="ticket__closer" />
                                    </div>
                                </div>
                            )
                        }) : null
                    }
                </div>
            </div>
        </>
    );
}
 
export default TicketsHistory;