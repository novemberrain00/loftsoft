import { FC} from "react";
import { Link } from "react-router-dom";

import './headerNavItem.scss';

interface HeaderNavItemPropsI {
    text: string,
    path: string
}
 
const HeaderNavItem: FC<HeaderNavItemPropsI> = ({text, path}) => {

    return (
        <li className="header__menu-item">
            <Link to={path}>
                <a 
                    href="/" 
                    className={`link header__menu-link ${window.location.href.includes(path) && 'header__menu-link_active'}`}
                >{text}</a>
            </Link>
        </li>
    );
}
 
export default HeaderNavItem;