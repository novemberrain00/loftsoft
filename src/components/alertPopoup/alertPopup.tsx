import { FC } from "react";

import './alertPopup.scss';

interface AlertPopupPropsI {
    text: string
    setText: React.Dispatch<React.SetStateAction<string>>
}
 
const AlertPopup: FC<AlertPopupPropsI> = ({text, setText}) => {
    return text.length ? (
        <div className="popup-overlay" onClick={() => setText('')}>
            <div className="alert-popup">{text}</div>
        </div>
    ) : null;
}
 
export default AlertPopup;