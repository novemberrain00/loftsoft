import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

import Overlay from "../overlay/overlay";

import CloseIcon from '../../assets/images/icons/close.svg';
import WalletIcon from '../../assets/images/icons/wallet_white.svg';

import { postData } from "../../services/services";
import { PaymentI } from "../../interfaces";
import { setReplenishment } from "../../redux/replenishmentSlice";

import './replenishPopup.scss';

interface ReplenishPopupPropsI {
    isOpened: boolean
    closeHandler: any
}
 
const ReplenishPopup: FC<ReplenishPopupPropsI> = ({isOpened, closeHandler}) => {
    const navigate = useNavigate();
    const [amount, setAmont] = useState<number>(0);

    const dispatch = useDispatch();
    
    const createReplenish = async () => {
        await postData('/user/balance/replenish', {
            payment_type: 'sbp',
            amount
        },true)
        .then((data: PaymentI) => {
            dispatch(setReplenishment(data));
            window.localStorage.setItem('timeToPay', '600')
            navigate('/profile/replenish');
        });
    } 


    return isOpened ? (
        <Overlay closeHandler={closeHandler}>
            <div className="replenish">
                <h2 className="replenish__header">
                    Пополните баланс
                    <img src={CloseIcon} onClick={() => closeHandler(false)} alt="закрыть" className="replenish__closer"/>
                </h2>
                <label htmlFor="replenish-value" className="input replenish__input">
                    <span className="input__label">Сумма пополнения</span>
                    <input 
                        onInput={(e) => setAmont(+(e.target as HTMLInputElement).value)}
                        value={+amount ||''}
                        type="text" 
                        className="input__text replenish__input-value" 
                        placeholder="Сумма пополнения" 
                        id="replenish-value" 
                        required
                    />
                </label>
                <button 
                    onClick={() => createReplenish()}
                    disabled={!!!+amount} 
                    className="replenish__btn btn"
                >
                    <img src={WalletIcon} alt="пополнить баланс" className="replenish__btn-icon" />
                    Пополнить по СБП
                </button>
            </div>
        </Overlay>
    ) : null;
}
 
export default ReplenishPopup;