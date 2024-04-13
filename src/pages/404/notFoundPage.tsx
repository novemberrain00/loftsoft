import { FC } from "react";
import RootPage from "../rootPage/rootPage";

import NotFoundImg from "../../assets/images/img/404.png";
import { Link } from "react-router-dom";

import "./notFoundPage.scss";

interface NotFoundPagePropsI {
    
}
 
const NotFoundPage: FC<NotFoundPagePropsI> = () => {
    return (
        <RootPage isFooterHidden={true}>
            <div className="not-found">
                <h1 className="not-found__title"> 404 </h1>
                <h3 className="not-found__subtitle"> Страница не найдена</h3>
                <Link to="/">
                    <a href="/" className="not-found__link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="37" height="22" viewBox="0 0 37 22" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M35.36 11.1582H2H35.36Z" fill="#2767FE"/>
                            <path d="M35.36 11.1582H2" stroke="#2667FF" stroke-width="3.05263" stroke-linecap="round" stroke-linejoin="round"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.51 20.3158L2 11.1579L14.51 2" fill="#2767FE"/>
                            <path d="M14.51 20.3158L2 11.1579L14.51 2" stroke="#2667FF" stroke-width="3.05263" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Вернуться на главную
                    </a>
                </Link>
            </div>
            
        </RootPage>
    );
}
 
export default NotFoundPage;