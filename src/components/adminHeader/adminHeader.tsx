import { FC, ReactNode } from "react";
import { useDispatch } from "react-redux";

import BurgerMenuIcon from '../../assets/images/icons/burger-menu.svg';

import './adminHeader.scss';
import { opendSidebar } from "../../redux/adminSidebarSlice";

interface AdminHeaderPropsI {
   title: string
   children?: ReactNode 
}
 
const AdminHeader: FC<AdminHeaderPropsI> = ({title, children}) => {
    const dispatch = useDispatch();

    return (
        <header className="header">
            <button onClick={() => dispatch(opendSidebar())} className="hamburger mobile-flex">
                <img src={BurgerMenuIcon} alt="открыть меню" className="hamburger__icon" />
            </button>
            <div className="header__buttons">
                <h1 className="title header__title">{title}</h1>
                {children}
            </div>
        </header>
    );
}
 
export default AdminHeader;