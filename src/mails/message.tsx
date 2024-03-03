import { FC } from "react";
import MailsRoot from "../components/mailsRoot/mailsRoot";

interface MessageMailsPropsI {
    
}
 
const MessageMail: FC<MessageMailsPropsI> = () => {
    return (
        <MailsRoot title='У вас новое сообщение от поддержки!' subtitle="Сообщение от поддержки:">
            <table className="message mail__container">
                <tr>
                    <td>
                        <p className="message__text">
                            Сообщение от поддержки будет выглядеть вот так....
                            Сообщение от поддержки будет выглядеть вот так....
                            Сообщение от поддержки будет выглядеть вот так....
                            Сообщение от поддержки будет выглядеть вот так....
                            Сообщение от поддержки будет выглядеть вот так....
                            Сообщение от поддержки будет выглядеть вот так....
                            Сообщение от поддержки будет выглядеть вот так....
                            Сообщение от поддержки будет выглядеть вот так....
                            Сообщение от поддержки будет выглядеть вот так....
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button className="btn mail__btn">Перейти&nbsp;к&nbsp;сообщениям</button>
                    </td>
                </tr>

            </table>
        </MailsRoot>
    );
}
 
export default MessageMail;