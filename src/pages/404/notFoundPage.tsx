import { FC } from "react";
import RootPage from "../rootPage/rootPage";

import NotFoundImg from "../../assets/images/img/404.png";

import "./notFoundPage.scss";
import { Link } from "react-router-dom";

interface NotFoundPagePropsI {
    
}
 
const NotFoundPage: FC<NotFoundPagePropsI> = () => {
    return (
        <RootPage isFooterHidden={true}>
            <img src={NotFoundImg} alt="страница не найдена" className="not-found-image"/>
            <Link to="/">
                <a href="/" className="not-found-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="37" height="22" viewBox="0 0 37 22" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M35.36 11.1582H2H35.36Z" fill="#2767FE"/>
                        <path d="M35.36 11.1582H2" stroke="#2667FF" stroke-width="3.05263" stroke-linecap="round" stroke-linejoin="round"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.51 20.3158L2 11.1579L14.51 2" fill="#2767FE"/>
                        <path d="M14.51 20.3158L2 11.1579L14.51 2" stroke="#2667FF" stroke-width="3.05263" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Вернуться на главную
                </a>
            </Link>
        </RootPage>
    );
}
 
export default NotFoundPage;