import { FC, ReactNode, useState } from "react";

import './categoryPopup.scss';

interface PopupPropsI {
    isPopupOpened: boolean
    setIsPopupOpened: React.Dispatch<React.SetStateAction<boolean>>
    children: ReactNode
}
 
const Popup: FC<PopupPropsI> = ({isPopupOpened, setIsPopupOpened, children}) => {

    const closeHandler = (e: MouseEvent) => {
        if((e.target as HTMLElement).classList.contains('popup-overlay')) {
            setIsPopupOpened(false);
        }
    };

    (document.querySelector('html') as HTMLElement).style.overflow = isPopupOpened ? 'hidden' : 'initial';
    (document.querySelector('html') as HTMLElement).style.height = isPopupOpened ? '100vh' : 'auto';

    return isPopupOpened ? (
        <div className="popup-overlay" onClick={(e: any) => closeHandler(e)}>
            <div className="popup">
                {children}
            </div>
        </div>
    ) : null;
}
 
export default Popup;