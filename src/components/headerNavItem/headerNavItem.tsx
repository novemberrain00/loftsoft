import { FC, useState } from "react";
import { Link } from "react-router-dom";

import './headerNavItem.scss';

interface HeaderNavItemPropsI {
    text: string,
    path: string
}
 
const HeaderNavItem: FC<HeaderNavItemPropsI> = ({text, path}) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <li className="header__menu-item">
            <Link to={path}>
                <a href="#" onClick={() => {
                }} className={`link header__menu-link ${window.location.href.includes(path) && 'header__menu-link_active'}`}>{text}</a>
            </Link>
        </li>
    );
}
 
export default HeaderNavItem;