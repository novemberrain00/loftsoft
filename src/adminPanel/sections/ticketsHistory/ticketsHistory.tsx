import { FC, useEffect, useState } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import BackArrow from "../../../assets/images/icons/arrow_left.svg";
import Avatar from "../../../assets/images/img/ava.png";
import CloseTicketIcon from "../../../assets/images/icons/close.svg";

import { useNavigate } from "react-router-dom";
import { getData } from "../../../services/services";
import { SupportTicketI } from "../../../interfaces";

import './ticketsHistory.scss';

interface TicketsHistoryPropsI {
    
}
 
const TicketsHistory: FC<TicketsHistoryPropsI> = () => {
    const navigate = useNavigate();
    const [ticketsList, setTicketsList] = useState<SupportTicketI[]>([]);

    useEffect(() => {
        getData('/tickets/opened', true)
        .then((data: SupportTicketI[]) => setTicketsList(data));
    }, []);

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    return (
        <>
            <AdminHeader title="Начало работы">
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
                                            <span className="ticket__num">
                                                Ticket#{id} {status === 'closed' ? `(closed ${closed_at})` : null}
                                            </span>
                                            <h4 className="ticket__name">{user.username}</h4>
                                        </div>
                                        <a href="#" className="ticket__delete">удалить навсегда</a>
                                        <img src={CloseTicketIcon} alt="закрыть" className="ticket__closer" />
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