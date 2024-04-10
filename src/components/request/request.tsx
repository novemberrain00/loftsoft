import { FC, MouseEvent, useEffect, useState } from "react";
import Overlay from "../overlay/overlay";

import ArrowIcon from "../../assets/images/icons/arrow_right_bold.svg";
import TrashIcon from "../../assets/images/icons/trash_blue.svg";
import TgIcon from "../../assets/images/icons/tg_round.svg";
import WhatsAppIcon from "../../assets/images/icons/whatsapp_round.svg";
import EmailIcon from "../../assets/images/icons/email.svg";

import { RequestI } from "../../interfaces";
import "./request.scss";
import { postData } from "../../services/services";
import { count } from "console";

interface RequestPropsI {
    isOpened: boolean
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
}
 
const Request: FC<RequestPropsI> = ({isOpened, closeHandler}) => {
    const [isConnectionsShowed, setIsConnectionsShowed] = useState(false);
    const [requests, setRequests] = useState<RequestI[]>([
        {
            contact_type: "",
            contact: "",
            files: [],
            count: 0,
            full_name: "",
            description: ""
        }
    ]);
    const [activeRequest, setActiveRequest] = useState(0);
    const [curRequest, setCurRequest] = useState<RequestI>({
        contact_type: "",
        contact: "",
        files: [],
        count: 0,
        full_name: "",
        description: ""
    });
    const [alertMessage, setAlertMessage] = useState('');

    const createRequest = (e: MouseEvent) => {
        e.preventDefault();
        const requestsRef = requests;
        requestsRef.push({
            contact_type: "",
            contact: "",
            files: [],
            count: 0,
            full_name: "",
            description: ""
        })
        setRequests([...requestsRef])
        setActiveRequest(requests.length-1)
    }

    const deleteRequest = (i: number) => {
        if(requests.length === 1) return;
        
        const requestsRef = requests;
        requestsRef.splice(i, 1);
        setRequests([...requestsRef]);
        setCurRequest(i === 0 ? requests[0] : requests[i - 1])
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

            if(count <= 0) {
                setAlertMessage(`Кол-во должно быть > 0. Запрос №${i+1}`);
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

            if(!description.length) {
                setAlertMessage(`Введите описание. Запрос №${i+1}`);
                isDataOk = false;
                return;
            }
        })

        if(isDataOk) {
            await postData('/product/request', requests)
            .then(() => closeHandler(false))
        }
    }

    useEffect(() => {
        const newList = requests;
        newList[activeRequest] = curRequest;
        setRequests(newList);
    }, [curRequest]);

    useEffect(() => setCurRequest(requests[activeRequest]), [activeRequest])

    return isOpened ? (
        <Overlay closeHandler={closeHandler}>
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
                    <input  
                        onInput={(e) => {
                            setCurRequest({
                                ...curRequest, 
                                contact: (e.target as HTMLInputElement).value
                            })
                        }}
                        value={curRequest.contact}
                        placeholder="Контакт" 
                        type="text" 
                        className="purchase__form-input"
                    />
                    <input  
                        onInput={(e) => {
                            setCurRequest({
                                ...curRequest, 
                                count: +(e.target as HTMLInputElement).value || 0
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
                    <input  
                        onInput={(e) => {
                            setCurRequest({
                                ...curRequest, 
                                description: (e.target as HTMLInputElement).value
                            })
                        }}
                        value={curRequest.description}
                        style={{marginTop: '20px'}}
                        placeholder="Описание товара" 
                        type="text" 
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
    ) : null;
}
 
export default Request;