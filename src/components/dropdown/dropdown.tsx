import {FC} from "react";

import DropdownArrowIcon from '../../assets/images/icons/dropdown-arrow.svg';
import './dropdown.scss';

interface DropdownPropsI {
    text: string
    classList: string
    children: React.ReactNode
    isListOpened: boolean
    isMobile?: boolean 
    setIsListOpened: React.Dispatch<React.SetStateAction<boolean>>
}
 
const Dropdown: FC<DropdownPropsI> = ({text, classList, isListOpened, setIsListOpened, isMobile, children}) => {
    return !isMobile ? (
        <li className={'dropdown ' + classList}>
             <span 
                className={`dropdown__trigger ${isListOpened ? 'dropdown__trigger_active' : ''}`} 
                onClick={() => {
                    setIsListOpened(!isListOpened);
                }}
            >
                {text} <img src={DropdownArrowIcon} alt={text} />
            </span>
            <div className={`dropdown__children ${isListOpened && 'dropdown__children_opened'}`}>
                {children}
            </div>
        </li>
    ) : (
        <div className={`dropdown__children ${isListOpened && 'dropdown__children_opened'}`}>
            {children}
        </div>
    );
}
 
export default Dropdown;