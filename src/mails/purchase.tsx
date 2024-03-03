import { FC } from "react";
import MailsRoot from "../components/mailsRoot/mailsRoot";

interface PurchaseMailPropsI {
    
}
 
const PurchaseMail: FC<PurchaseMailPropsI> = () => {
    return (
        <MailsRoot title='Поздравляем с покупкой товаров!' subtitle="Спасибо, что выбрали сервис LoftSoft">
            <table className="purchase mail__container">
                <tr>
                    <div className="keys">
                        <td>
                            <div className="keys__item">
                                WINDOWS 11 PRO Key:
                                <div className="keys__item-value">W269N-WFGWX-YVC9B-4J6C9-T83GX</div>
                            </div>
                        </td>
                        <td>
                            <div className="keys__item">
                                WINDOWS 11 PRO Key:
                                <div className="keys__item-value">W269N-WFGWX-YVC9B-4J6C9-T83GX</div>
                            </div>
                        </td>
                    </div>
                </tr>
                <tr>
                    <div className="links">
                        <td>
                            <div className="links__item">
                                Скачать последнюю версию программ вы можете по этим ссылкам:
                                <a href='#' className="links__item-value link">https://www.microsoft.com/ru-ru/software-download/windows11</a>
                            </div>
                        </td>
                        <td>
                            <div className="links__item">
                                Информацию по активации вы можете прочитать здесь:
                                <a href='#' className="links__item-value link">https://www.microsoft.com/ru-ru/software-download/windows11</a>
                            </div>
                        </td>
                    </div>
                </tr>
            </table>
        </MailsRoot>
    );
}
 
export default PurchaseMail;