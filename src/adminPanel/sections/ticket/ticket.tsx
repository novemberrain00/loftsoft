import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SendIcon from '../../../assets/images/icons/send_rounded.svg';
import BackArrow from '../../../assets/images/icons/arrow_left.svg';

import AdminHeader from "../../../components/adminHeader/adminHeader";

import { SupportTicketI } from "../../../interfaces";
import { getData, postData, timestampToTime } from "../../../services/services";

import './ticket.scss'; 

interface TicketPropsI {
}
 
const Ticket: FC<TicketPropsI> = () => {
    const [ticket, setTicket] = useState<SupportTicketI>({} as SupportTicketI);
    const [message, setMessage] = useState<string>('');
    const {id} = useParams();
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;



    const sendMessage = async () => {
        if(!message.length) return;

        await postData('/tickets/send', {
            id,
            text: message,
            attachments: []
        }, true)
        .then((data: SupportTicketI) => {
            setTicket(data);
            setMessage('');
        });
    }

    

    useEffect(() => {
        getData(`/ticket/${id}`, true)
        .then((data: SupportTicketI) => setTicket(data));

        let delay = 1000;
        let timeout: NodeJS.Timeout | null = null;

        const updateChat = () => {
            getData(`/ticket/${id}`, true)
            .then((data: SupportTicketI) => {
            setTicket(data);
            delay = 1000;
            timeout = setTimeout(updateChat, delay);

          }).catch(error => {
            delay = delay * 2;
            timeout = setTimeout(updateChat, delay);
          });
        }
    
        updateChat();

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }, []);

    return (
        <>
            <AdminHeader title={`Тикет №${id}`}>
                <button onClick={() => navigate(-1)} className="admin__btn btn">
                    <img src={BackArrow} alt="назад"/>
                    Назад
                </button>
            </AdminHeader>
            <div className="ticket-page">
                <div className="ticket-page__messages">
                    {
                        ticket.messages?.length ? ticket.messages.map(({text, id, role, created_at}) => {
                            return (
                                <div key={id} className={role === 'user' ? "ticket-page__message" : "ticket-page__message ticket-page__message_mine"}>
                                    {
                                        role === "user" ? (
                                            <div className="ticket-page__message-avatar">
                                                <img src={baseURL + '/uploads/' + ticket.user.photo} alt="" />
                                            </div>
                                        ) : null

                                    }
                                    <div className="ticket-page__message-body">
                                        {text}
                                    </div>
                                    <div className="ticket-page__message-bottom">
                                        {role === 'user' ? <span>{ticket.user.email}</span> : null}
                                        <span>{timestampToTime(created_at)}</span>
                                    </div>
                                </div>                  
                            )
                        }) : null
                    }
                </div>
                <form action="post" className="ticket-page__form">
                    <textarea 
                        onInput={(e) => setMessage((e.target as HTMLInputElement).value)} 
                        placeholder="Введите ваше сообщение" 
                        className="ticket-page__input"
                        value={message}
                    ></textarea>
                    <button onClick={(e) => {
                        e.preventDefault();
                        sendMessage();  
                    }} className="btn ticket-page__sender">
                        <img src={SendIcon} alt="отправить" />
                    </button>
                </form>
            </div>
        </>
    );
}
 
export default Ticket;