import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

import AdminHeader from "../../../components/adminHeader/adminHeader";

import BackArrow from '../../../assets/images/icons/arrow_left.svg';
import SaveIcon from "../../../assets/images/icons/save.svg";

import { getData, postData } from "../../../services/services";

import './billingData.scss';
import { addSnack } from "../../../redux/snackbarSlice";

interface BillingDataPropsI {
    
}

interface SBPDataI {
    token: string
    pin_code: string
    phone: string
    fio: string
}
 
const BillingData: FC<BillingDataPropsI> = () => {
    const [pintype, setPintype] = useState('password');
    const [sbpData, setSbpData] = useState<SBPDataI>({
        token: '',
        pin_code: '',
        phone: '',
        fio: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const saveBillingSBPData = async () => {
        const {token, pin_code, phone, fio} = sbpData;

        if(!token.length) {
            dispatch(addSnack({text: 'Введите токен'}));
            return;
        }

        if(!pin_code.length) {
            dispatch(addSnack({text: 'Введите пин-код'}));
            return;
        }

        if(!phone.length) {
            dispatch(addSnack({text: 'Введите номер телефона'}));
            return;
        }

        if(!fio.length) {
            dispatch(addSnack({text: 'Введите ФИО'}));
            return;
        }

        await postData('/payments/sbp/ozone', sbpData, true)
        .then(() => dispatch(addSnack({text: 'Данные успешно обновлены'})));
    }

    useEffect(() => {
        getData('/payments/sbp/ozon', true)
        .then(data => setSbpData({
            token: data.token,
            pin_code: data.pin_code,
            phone: data.phone,
            fio: data.fio
        }));
    }, [])

    return (
        <>
            <AdminHeader title="Настройка платежной системы">
                <button onClick={() => navigate(-1)} className="btn admin__btn">
                    <img src={BackArrow} alt="назад" />
                    Назад
                </button> 
            </AdminHeader>
            <form onSubmit={(e) => {
                e.preventDefault();
                saveBillingSBPData();
            }} className="billing">
                <label htmlFor="billing-token" className="input billing__token">
                    <span className="input__label billing__token">Токен доступа</span>
                    <input 
                        onInput={(e) => setSbpData({...sbpData, token: (e.target as HTMLInputElement).value})}
                        value={sbpData.token}
                        type="text" 
                        id="billing-token" 
                        className="input__text billing__token-text" 
                        placeholder="Введите ваш токен доступа"
                    />
                </label>
                <label htmlFor="billing-pin" className="input billing__input">
                    <span className="input__label">Пин-код</span>
                    <input 
                        onInput={(e) => setSbpData({...sbpData, pin_code: (e.target as HTMLInputElement).value})}
                        value={sbpData.pin_code}
                        type={pintype}
                        id="billing-pin" 
                        className="input__text" 
                        placeholder="Пин-код"
                    />
                    <div 
                        onMouseDown={() => setPintype('text')} 
                        onMouseUp={() => setPintype('password')} 
                        onTouchStart={() => setPintype('text')}
                        onTouchEnd={() => setPintype('password')}
                        className="billing__eye"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
                            <path d="M24.1514 12.6836C24.1172 12.6064 23.29 10.7715 21.4512 8.93262C19.001 6.48242 15.9062 5.1875 12.5 5.1875C9.09374 5.1875 5.99901 6.48242 3.54882 8.93262C1.70995 10.7715 0.878897 12.6094 0.848623 12.6836C0.804203 12.7835 0.78125 12.8916 0.78125 13.001C0.78125 13.1103 0.804203 13.2184 0.848623 13.3184C0.882803 13.3955 1.70995 15.2295 3.54882 17.0684C5.99901 19.5176 9.09374 20.8125 12.5 20.8125C15.9062 20.8125 19.001 19.5176 21.4512 17.0684C23.29 15.2295 24.1172 13.3955 24.1514 13.3184C24.1958 13.2184 24.2187 13.1103 24.2187 13.001C24.2187 12.8916 24.1958 12.7835 24.1514 12.6836ZM12.5 19.25C9.49413 19.25 6.86815 18.1572 4.69433 16.0029C3.80238 15.1159 3.04353 14.1044 2.4414 13C3.04337 11.8954 3.80223 10.884 4.69433 9.99707C6.86815 7.84277 9.49413 6.75 12.5 6.75C15.5059 6.75 18.1318 7.84277 20.3057 9.99707C21.1993 10.8837 21.9598 11.8952 22.5635 13C21.8594 14.3145 18.792 19.25 12.5 19.25ZM12.5 8.3125C11.5729 8.3125 10.6666 8.58742 9.89576 9.10249C9.1249 9.61756 8.52409 10.3496 8.16931 11.2062C7.81452 12.0627 7.72169 13.0052 7.90256 13.9145C8.08343 14.8238 8.52987 15.659 9.18543 16.3146C9.84099 16.9701 10.6762 17.4166 11.5855 17.5974C12.4948 17.7783 13.4373 17.6855 14.2938 17.3307C15.1503 16.9759 15.8824 16.3751 16.3975 15.6042C16.9126 14.8334 17.1875 13.9271 17.1875 13C17.1862 11.7572 16.6919 10.5657 15.8131 9.68686C14.9343 8.80807 13.7428 8.31379 12.5 8.3125ZM12.5 16.125C11.8819 16.125 11.2777 15.9417 10.7638 15.5983C10.2499 15.255 9.84939 14.7669 9.61287 14.1959C9.37634 13.6249 9.31446 12.9965 9.43504 12.3903C9.55562 11.7842 9.85324 11.2273 10.2903 10.7903C10.7273 10.3533 11.2841 10.0556 11.8903 9.93505C12.4965 9.81447 13.1249 9.87635 13.6959 10.1129C14.2669 10.3494 14.755 10.7499 15.0983 11.2638C15.4417 11.7777 15.625 12.3819 15.625 13C15.625 13.8288 15.2958 14.6237 14.7097 15.2097C14.1236 15.7958 13.3288 16.125 12.5 16.125Z" fill="#777E90"/>
                        </svg>
                    </div>
                </label>
                <label htmlFor="billing-phone" className="input billing__input">
                    <span className="input__label">Номер телефона от ЛК</span>
                    <input 
                        onInput={(e) => setSbpData({...sbpData, phone: (e.target as HTMLInputElement).value})}
                        value={sbpData.phone}
                        type="text" 
                        id="billing-phone" 
                        className="input__text" 
                        placeholder="Номер телефона от ЛК"
                    />
                </label>
                <label htmlFor="billing-fio" className="input billing__input">
                    <span className="input__label">ФИО из личного кабинета</span>
                    <input 
                        onInput={(e) => setSbpData({...sbpData, fio: (e.target as HTMLInputElement).value})}
                        value={sbpData.fio}
                        type="text" 
                        id="billing-fio" 
                        className="input__text" 
                        placeholder="ФИО из личного кабинета"
                    />
                </label>

                <button style={{width: 'max-content'}} className="btn admin__btn">
                    <img src={SaveIcon} alt="сохранить" className="admin__btn-icon" />
                    Сохранить данные
                </button>
            </form>
        </>
    );
}
 
export default BillingData;