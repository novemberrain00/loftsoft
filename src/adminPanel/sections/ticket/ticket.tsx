import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SendIcon from '../../../assets/images/icons/send_rounded.svg';
import BackArrow from '../../../assets/images/icons/arrow_left.svg';
import Checkicon from '../../../assets/images/icons/check_blue.svg';
import AttachmentIcon from '../../../assets/images/icons/attachment-img.svg'

import AdminHeader from "../../../components/adminHeader/adminHeader";

import { Attachment, SupportTicketI } from "../../../interfaces";
import { getData, postData, timestampToTime, uploadFile } from "../../../services/services";

import './ticket.scss'; 
import FsLightbox from "fslightbox-react";

interface TicketPropsI {
}
 
const Ticket: FC<TicketPropsI> = () => {
    const [ticket, setTicket] = useState<SupportTicketI>({} as SupportTicketI);
    const [message, setMessage] = useState<string>('');
    const [curImages, setCurImages] = useState<Attachment[]>([]);
    const [attachments, setAttachments] = useState<string[]>([]);
    const [toggler, setToggler] = useState(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(1);

    const {id} = useParams();
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const sendMessage = async () => {
        if(!message.length && !attachments.length) return;

        const messagesRef = ticket.messages;
        messagesRef.push({
            id: -1,
            role: 'admin',
            text: message,
            created_at:  new Date(Date.now()).toISOString(),
            attachments
        });

        setTicket({
            ...ticket,
            messages: messagesRef
        });

        setMessage('');
        setAttachments([])

        setTimeout(() => {
            document.body.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        }, 0);

        await postData('/tickets/send', {
            id,
            text: message,
            attachments
        }, true)
        .then((data: SupportTicketI) => {
            setTicket(data);
        });
    }


    useEffect(() => {
        let delay = 3000;
        let timeout: NodeJS.Timeout | null = null;
    
        const updateChat = () => {
            getData(`/ticket/${id}`, true)
            .then((data: SupportTicketI) => {
                setTicket(data);
                delay = 3000;
                timeout = setTimeout(updateChat, delay);
            })
            .catch(error => {
                delay = delay * 2;
                timeout = setTimeout(updateChat, delay);
            });
        }
    
        getData(`/ticket/${id}`, true)
        .then((data: SupportTicketI) => {
            setTicket(data);
            timeout = setTimeout(updateChat, delay);
        });
    
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }, [id]);

    useEffect(() => console.log(curImages), [curImages])

    return (
        <>
            <AdminHeader title={`Тикет №${id}`}>
                <button onClick={() => navigate(-1)} className="admin__btn btn">
                    <img src={BackArrow} alt="назад"/>
                    Назад
                </button>
            </AdminHeader>
            <div className="ticket-page">
                <FsLightbox 
                    toggler={toggler}
                    slide={activeSlideIndex}
                    key={curImages.length}
                    sources={[...curImages.map(attach => <img key={attach.id} src={baseURL + '/uploads/' + attach.file} alt="Не удалось загрузить изображение"/>)]}
                />
                <div className="ticket-page__messages">
                    {
                        ticket.messages?.length ? ticket.messages.map(({text, id, role, attachments, created_at}) => {
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

                                        {
                                            attachments.length ? (attachments as Attachment[]).map(({id, file}, i) => {
                                                return (
                                                    <img 
                                                        key={id} 
                                                        src={baseURL + '/uploads/' + file} 
                                                        onClick={() => {
                                                            setCurImages(attachments as Attachment[])
                                                            setToggler(!toggler)
                                                            setActiveSlideIndex(i+1)
                                                        }} 
                                                        alt="Не удалось загрузить изображение" 
                                                        className="ticket-page__message-attachment"
                                                    />
                                                )
                                            }) : null
                                        }   
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
                    <div className="ticket-page__form-files">
                        {
                            attachments.length ? attachments.map(attach => {
                                return ( 
                                    <div className="ticket-page__form-attachment">
                                        <span className="ticket-page__form-icon">
                                            <img src={AttachmentIcon} alt="прикрепленное изображение"/>
                                        </span>
                                        <a href={baseURL + '/uploads/' + attach} target="blank" className="ticket-page__form-link">
                                            {attach}
                                        </a>
                                    </div>
                                )
                            }) : null
                        }
                    </div>
                    <div className="ticket-page__form-bottom">
                        <textarea 
                            onInput={(e) => setMessage((e.target as HTMLInputElement).value)} 
                            placeholder="Введите ваше сообщение" 
                            className="ticket-page__input"
                            value={message}
                        ></textarea>
                        <label htmlFor="ticket-page-file" className="ticket-page__file">
                            <input
                                onInput={(e) => {
                                    Array.from((e.target as HTMLInputElement).files as FileList).forEach(file => {
                                        uploadFile(file).then((data) => {
                                            const attachmentsRef = attachments;
                                            attachments.push(data.upload);

                                            setAttachments([...attachmentsRef]);
                                        })
                                    })
                                }}
                                multiple
                                type="file" 
                                id="ticket-page-file" 
                                className="ticket-page__file-input" 
                            />
                            <img src={Checkicon} alt="прикрепить файлы" />
                        </label>
                        <button onClick={(e) => {
                            e.preventDefault();
                            sendMessage();  
                        }} className="btn ticket-page__sender">
                            <img src={SendIcon} alt="отправить" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
 
export default Ticket;