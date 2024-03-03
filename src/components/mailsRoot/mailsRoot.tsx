import { FC, ReactNode } from "react";

import Logolarge from '../../assets/images/logo/logo_large.svg';
import MailLogo from '../../assets/images/logo/mail-logo.svg';
import CartIcon from '../../assets/images/icons/cart_white.svg';
import Icon24 from '../../assets/images/icons/24.svg';
import LightningIcon from '../../assets/images/icons/lightning.svg';

import '../../mails/mails.scss';
//import '../../lib/foundation-emails/foundation-emails.css';

interface MailsRootPropsI {
    title: string
    subtitle: string
    children: ReactNode
}
 
const MailsRoot: FC<MailsRootPropsI> = ({title, subtitle, children}) => {
    return (
        <table className="mail">
            <tr>
                <td>
                    <div className="mail__container">
                        <header className="header">
                            <img src={Logolarge} alt="Logo" className="header__logo"/>
                            <h1 className="header__title">{title}</h1>
                            <h3 className="header__subtitle">{subtitle}</h3>
                        </header>
                    </div>
                </td>
            </tr>
            <tr>
                {children}
            </tr>
            <tr> 
                <td>
                    <footer className="footer">
                        <div className="features">
                            <h2 className="features__title">C уважением, <br />“ООО Лофт-Софт”</h2>
                            <table className="features__content">
                                <tr>
                                    <td className="features__item">
                                        <img src={CartIcon} alt="широкий ассортимент" className="features__item-icon" />
                                        широкий <br /> ассортимент
                                    </td>
                                    <td className="features__item">
                                        <img src={Icon24} alt="поддержка 24/7" className="features__item-icon" />
                                        поддержка <br /> 24/7
                                    </td>
                                    <td className="features__item">
                                        <img src={LightningIcon} alt="моментальная выдача товара" className="features__item-icon" />
                                        моментальная выдача товара
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="features__warning">Данное письмо не является офертой. Все цены действительны на момент покупки.</div>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div className="copyright">
                            <img src={MailLogo} alt="loftsoft" className="copyright__logo" />
                            <span className="copyright__years">2023 - 2024 ©</span>
                            <span className="copyright__rights">All rights reserved</span>
                        </div>
                            
                    </footer>
                </td>
            </tr>
        </table>
    )
}
 
export default MailsRoot;