import { FC } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import BackArrow from "../../../assets/images/icons/arrow_left.svg";
import Avatar from "../../../assets/images/img/ava.png";
import CloseTicketIcon from "../../../assets/images/icons/close.svg";

import { useNavigate } from "react-router-dom";
import './ticketsHistory.scss';

interface TicketsHistoryPropsI {
    
}
 
const TicketsHistory: FC<TicketsHistoryPropsI> = () => {
    const navigate = useNavigate();

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
                    <div className="tickets__item ticket">
                        <div className="ticket__body">
                            <img src={Avatar} alt="" className="ticket__img" />
                            <div className="ticket__info">
                                <span className="ticket__num">
                                    Ticket#12 (closed 11.02.2023)
                                </span>
                                <h4 className="ticket__name">Nickname</h4>
                            </div>
                            <a href="#" className="ticket__delete">удалить навсегда</a>
                            <img src={CloseTicketIcon} alt="закрыть" className="ticket__closer" />
                        </div>
                    </div>
                    <div className="tickets__item ticket">
                        <div className="ticket__body">
                            <img src={Avatar} alt="" className="ticket__img" />
                            <div className="ticket__info">
                                <span className="ticket__num">
                                    Ticket#12 (closed 11.02.2023)
                                </span>
                                <h4 className="ticket__name">Nickname</h4>
                            </div>
                            <a href="#" className="ticket__delete">удалить навсегда</a>
                            <img src={CloseTicketIcon} alt="закрыть" className="ticket__closer" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default TicketsHistory;