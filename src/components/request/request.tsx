import { FC, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux"
import Overlay from "../overlay/overlay";

import ArrowIcon from "../../assets/images/icons/arrow_right_bold.svg";
import TrashIcon from "../../assets/images/icons/trash_blue.svg";
import TgIcon from "../../assets/images/icons/tg_round.svg";
import WhatsAppIcon from "../../assets/images/icons/whatsapp_round.svg";
import EmailIcon from "../../assets/images/icons/email.svg";
import SuccessIcon from "../../assets/images/icons/request-success.svg";
import TgBlackIcon from "../../assets/images/icons/tg_black.svg";
import MailBlackIcon from "../../assets/images/icons/mail_black.svg";
import WhatsappBlackIcon from "../../assets/images/icons/whatsapp_black.svg";

import { RequestI } from "../../interfaces";
import { postData } from "../../services/services";
import { RootState } from "../../store";
import "./request.scss";

interface RequestPropsI {
    isOpened: boolean
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
}
 
const Request: FC<RequestPropsI> = ({isOpened, closeHandler}) => {
    const userData = useSelector((state: RootState) => state.user.userInfo);

    const [isConnectionsShowed, setIsConnectionsShowed] = useState(false);
    const [isSuccessShowed, setIsSuccessShowed] = useState(false);
    const [requests, setRequests] = useState<RequestI[]>([
        {
            contact_type: "email",
            contact: userData.email || '',
            files: [],
            count: "",
            full_name: "",
            description: ""
        }
    ]);
    const [activeRequest, setActiveRequest] = useState(0);
    const [curRequest, setCurRequest] = useState<RequestI>({
        contact_type: "email",
        contact: userData.email || '',
        files: [],
        count: "",
        full_name: "",
        description: ""
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [lastRequestContact, setLastRequestContact] = useState({
        contactType: '',
        contact: ''
    });

    const createRequest = (e: MouseEvent) => {
        e.preventDefault();
        const requestsRef = requests;
        requestsRef.push({
            contact_type: "email",
            contact: userData.email || '',
            files: [],
            count: "",
            full_name: "",
            description: ""
        });
        setRequests([...requestsRef]);
        setActiveRequest(requests.length-1);
    }

    const deleteRequest = (i: number) => {
        if(requests.length === 1) return;
        
        const requestsRef = requests;
        requestsRef.splice(i, 1);
        setRequests([...requestsRef]);
        setCurRequest(i === 0 ? requests[0] : requests[i - 1])
        setActiveRequest(i === 0 ? 0 : i-1)
    }

    const changeConnectionType = (type: string) => {
        setCurRequest(({
            ...curRequest, 
            contact_type: type
        }))
        setIsConnectionsShowed(false);
    }

    const sendRequests = async (e: MouseEvent) => {
        e.preventDefault();
        if(!requests.length) return;

        if(requests.length === 1) {
            setLastRequestContact({
                contactType: requests[0].contact_type,
                contact: requests[0].contact
            })
        }

        let isDataOk = true;
        requests.forEach(({full_name, contact, contact_type, count, description}, i) => {
            if(!contact_type) {
                setAlertMessage(`Не установлен тип связи. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }

            if(!full_name.length) {
                setAlertMessage(`Введите название. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }

            if(+count <= 0) {
                setAlertMessage(`Кол-во должно быть > 0. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }

            if(isNaN(+count))  {
                setAlertMessage(`Некорректное количество. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }

            if(!contact.length) {
                setAlertMessage(`Введите данные для связи. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }

            if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contact) && contact_type === 'email') {
                setAlertMessage(`Некорректный Email. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }

            if(!/^(\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}|8\d{10})$/.test(contact) && contact_type === 'whatsapp') {
                setAlertMessage(`Некорректный номер. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }

            

            if(!description.length) {
                setAlertMessage(`Введите описание. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }
        })

        if(isDataOk) {
            await postData('/product/request', requests)
            .then(() =>{
                setRequests([
                    {
                        contact_type: "email",
                        contact: userData.email || '',
                        files: [],
                        count: "",
                        full_name: "",
                        description: ""
                    }
                ])
                setCurRequest({
                    contact_type: "email",
                    contact: userData.email || '',
                    files: [],
                    count: "",
                    full_name: "",
                    description: ""
                })
                setIsSuccessShowed(true)
            })
        }
    }

    const overlayCloseHandler = () => {
        setIsSuccessShowed(false)
        setLastRequestContact({
            contactType: '',
            contact: ''
        })
        closeHandler(false)
    }

    useEffect(() => {
        setCurRequest({
            contact_type: "email",
            contact: userData.email || '',
            files: [],
            count: "",
            full_name: "",
            description: ""
        })
    }, [userData.email])

    useEffect(() => {
        const newList = requests;
        newList[activeRequest] = curRequest;
        setRequests(newList);
    }, [curRequest]);

    useEffect(() => setAlertMessage(''), [isOpened])

    useEffect(() => setCurRequest(requests[activeRequest]), [activeRequest]);

    useEffect(() => setCurRequest({...curRequest, contact: ''}), [curRequest.contact_type])

    return isOpened ? (
        <>
        {
            isSuccessShowed ?
            <Overlay closeHandler={() => overlayCloseHandler()}>
                <div className="request request-success">
                    <div className="request__header">
                        <h3 className="request-success__title">Запрос отправлен</h3>
                        <h5 className="request-success__subtitle">
                            Дождитесь ответа на <br />
                            {
                                !lastRequestContact.contact.length ? 
                                    'указанные данные': 
                                    <span className="request-success__contact">
                                        {lastRequestContact.contactType === 'email' ? <img src={MailBlackIcon} alt="email"/> : ''}
                                        {lastRequestContact.contactType === 'telegram' ? <img src={TgBlackIcon} alt="tg"/> : ''}
                                        {lastRequestContact.contactType === 'whatsapp' ? <img src={WhatsappBlackIcon} alt="whatsapp"/> : ''}
                                        {lastRequestContact.contact}
                                    </span>
                            }
                        </h5>
                    </div>
                    <img src={SuccessIcon} alt="Запрос отправлен" className="request-success__img"/>
                    <p className="text text_large request-success__text">
                        В письме будет указано наличие и цены товара, которые необходимо будет изучить перед покупкой. Если возникнут вопросы - мы всегда на связи!
                    </p>
                    <a href="#" onClick={(e: MouseEvent) => {
                        e.preventDefault();
                        setIsSuccessShowed(false);
                        closeHandler(false)
                    }} className="request__footer-link request-success__link">Готово</a>
                </div>
            </Overlay> : 
            <Overlay closeHandler={() => overlayCloseHandler()}>
                <div className="request">
                    <header className="request__header">
                        <h3 className="request__title title">Запросить товар</h3>
                        <div className="request__header-tabs">
                            {
                                requests.length ? requests.map((req, i) => {
                                    return (
                                        <div 
                                            key={Math.random()} 
                                            onClick={() => setActiveRequest(i)} 
                                            className={`request__header-tab ${activeRequest === i ? 'request__header-tab_active' : ''}`}
                                        >
                                            <img src={TrashIcon} onClick={() => deleteRequest(i)} alt="Удалить" />
                                            Запрос #{i+1}
                                        </div>
                                    ) 
                                }) : null
                            }
                        </div>
                    </header>
                    <form action="post" className="purchase__form">
                        <div className="purchase__dropdown">
                            <div onClick={() => setIsConnectionsShowed(!isConnectionsShowed)} className="purchase__form-input purchase__dropdown-opener">
                                {curRequest.contact_type || 'Способ связи'}
                                <img src={ArrowIcon} style={{transform: isConnectionsShowed ? 'rotate(90deg)': ''}} alt="открыть" className="purchase__form-icon" />
                            </div>
                            <ul 
                                className={`list purchase__dropdown-list ${isConnectionsShowed? 'purchase__dropdown-list_opened' : null}`}
                            >
                                <li onClick={() => changeConnectionType('email')} className="purchase__dropdown-item">
                                    <img src={EmailIcon} alt="Через почту" />
                                    Через почту
                                </li>
                                <li onClick={() => changeConnectionType('whatsapp')} className="purchase__dropdown-item">
                                    <img src={WhatsAppIcon} alt="WhatsApp" />
                                    WhatsApp
                                </li>
                                <li onClick={() => changeConnectionType('telegram')} className="purchase__dropdown-item">
                                    <img src={TgIcon} alt="Telegram" />
                                    Telegram
                                </li>
                            </ul>
                        </div>
                       {
                            curRequest.contact_type === 'email' &&
                                <input  
                                    onInput={(e) => {
                                        setCurRequest({
                                            ...curRequest, 
                                            contact: (e.target as HTMLInputElement).value
                                        })
                                    }}
                                    value={curRequest.contact}
                                    placeholder='loftsoft@loftsoft.store'
                                    type="text" 
                                    className="purchase__form-input"
                                />
                        }
                        {
                            curRequest.contact_type === 'telegram' &&
                                <input  
                                    onInput={(e) => {
                                        setCurRequest({
                                            ...curRequest, 
                                            contact: (e.target as HTMLInputElement).value
                                        })
                                    }}
                                    value={curRequest.contact}
                                    placeholder='@telegram'
                                    type="text" 
                                    className="purchase__form-input"
                                />
                        }
                        {
                            curRequest.contact_type === 'whatsapp' &&
                                <input  
                                    onInput={(e) => {
                                        setCurRequest({
                                            ...curRequest, 
                                            contact: (e.target as HTMLInputElement).value
                                        })
                                    }}
                                    value={curRequest.contact}
                                    placeholder='+79999999999'
                                    type="text" 
                                    className="purchase__form-input"
                                />
                        }
                        <input  
                            onInput={(e) => {
                                setCurRequest({
                                    ...curRequest, 
                                    count: (e.target as HTMLInputElement).value 
                                })
                            }}
                            value={curRequest.count}
                            style={{marginTop: '20px'}}
                            placeholder="Количество (Мин.: 1)" 
                            type="text" 
                            className="purchase__form-input"
                        />
                        <input  
                            onInput={(e) => {
                                setCurRequest({
                                    ...curRequest, 
                                    full_name: (e.target as HTMLInputElement).value
                                })
                            }}
                            value={curRequest.full_name}
                            style={{marginTop: '20px'}}
                            placeholder="Полное название товара" 
                            type="text" 
                            className="purchase__form-input"
                        />
                        <textarea  
                            onInput={(e) => {
                                setCurRequest({
                                    ...curRequest, 
                                    description: (e.target as HTMLInputElement).value
                                })
                            }}
                            value={curRequest.description}
                            style={{marginTop: '20px'}}
                            placeholder="Описание товара" 
                            rows={1}
                            className="purchase__form-input"
                        />
                    </form>
                    <span className="request__alert">{alertMessage}</span>
                    <footer className="request__footer">
                        <a href="#" onClick={(e: MouseEvent) => createRequest(e)} className="request__footer-link">Создать ещё</a>
                        <a href="#" onClick={(e: MouseEvent) => sendRequests(e)} className="request__footer-link">Отправить всё</a>
                        <a href="#" onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            closeHandler(false)
                        }} className="request__footer-link">Закрыть</a>
                    </footer>
                </div>
            </Overlay>
        }
        </>
    ) : null;
}
 
export default Request;