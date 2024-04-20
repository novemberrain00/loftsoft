import { FC, MouseEvent, useEffect, useState } from "react";
import RootPage from "../rootPage/rootPage";

import { TabI } from "../../interfaces";
import './termsPage.scss';

interface TermsPagePropsI {
    tab?: number
}
 
const TermsPage: FC<TermsPagePropsI> = ({tab}) => {
    const [activeTab, setActiveTab] = useState(0);

    const [tabs, setTabs] = useState<TabI[]>(
    [
        {
            title: 'Основные положения',
            anchor: 0,
            content: (
                <section className="terms__section block">
                            <h2 className="title terms__section-title">Заявка на оформление замены товара</h2>
                            <p className="text text_small terms__section-text">
                                ЧТОБЫ ОФОРМИТЬ ЗАЯВКУ НА ЗАМЕНУ АККАУНТА: <br />
                                Сообщите в техподдержку на сайте ИЛИ telegram следующую информацию: <br />
                                Укажите номер заказа, который прикреплен к комментарию платежа, также его можно посмотреть в ответном письме с заказом, которое приходит на указанную Вами почту при оплате или в Личном Кабинете покупателей (история заказов). <br />
                                Опишите проблему. <br />
                                Укажите список невалидных аккаунтов. <br />
                                Прикрепите скриншот, где видна ошибка. <br />
                                Ваша заявка может выглядеть так: <br />
                                # <br />
                                Аккаунт заблокирован/неверный логин или пароль/товар не соответствует описанию и т.п. <br />
                                test123f@gmail.com: <br />
                                (скриншот) <br />
                                Наш Telegram: https://t.me/ <br />
                                Оставляйте заявку СРАЗУ при обнаружении проблемы, иначе вы рискуете лишиться гарантии! ( если мы даже не в сети ) <br />
                                Внимание! Если при проверке аккаунт был валидным и мы сообщили вам эту информацию, но после входа аккаунт оказался в блокировке, то возврата/замены товара НЕ БУДЕТ. <br />
                                Как оформить заявку на замену аккаунта, ЕСЛИ в описании товара указана обязательная  <br />
                                Чтобы заменить товар обязательно наличие видео! В этом случае видеозапись является доказательством того, что на момент покупки данные были неработоспособны. <br />
                                При записи соблюдайте эти требования: <br />
                                Видео записывается с момента перед оплатой и до конца проверки. <br />
                                В поле видимости должен быть полный экран, включая видимость "Дата" и меню "Пуск". <br />
                                Должен быть виден курсор. <br />
                                Не используйте монтаж и безосновательные паузы. <br />
                                Если вы не можете записать видео, обратитесь за проверкой товара к продавцу по указанным контактам на сайте. <br />
                                Как происходит замена/возврат денежных средств, когда Ваш заказ приняли в обработку. <br />
                                Замена товара осуществляется до 2-х рабочих дней. <br />
                                Возврат средств (манибек) возможен только при условии, если нельзя заменить товар на аналогичный. <br />
                            </p>
                </section>
            )
        }, 
        {
            title: 'Корректировки и правила',
            anchor: 1,
            content: (
                <section className="terms__section block">
                    <h2 className="title terms__section-title">Корректировки и правла</h2>
                    <p className="text text_small terms__section-text">
                        2
                    </p>
                </section>
            )
        },
        {
            title: 'Условия возврата/обмена',
            anchor: 2,
            content: (
                <section className="terms__section block">
                    <h2 className="title terms__section-title">Условия возврата/обмена</h2>
                    <p className="text text_small terms__section-text">
                       1
                    </p>
                </section>
            )
        },
        {
            title: 'Происхождение аккаунтов',
            anchor: 3,
            content: (
                <section className="terms__section block">
                    <h2 className="title terms__section-title">Происхождение аккаунтов</h2>
                    <p className="text text_small terms__section-text">
                        Происхождение аккаунтов
                    </p>
                </section>
            )
        },
        {
            title: 'Часто задаваемые вопросы',
            anchor: 4,
            content: (
                <section className="terms__section block">
                    <h2 className="title terms__section-title">Часто задаваемые вопросы</h2>
                    <p className="text text_small terms__section-text">
                        Часто задаваемые вопросы
                    </p>
                </section>
            )
        }, 
        {
            title: 'Безопасность конфиденциальности',
            anchor: 5,
            content: (
                <section className="terms__section block">
                    <h2 className="title terms__section-title">Безопасность конфиденциальности</h2>
                    <p className="text text_small terms__section-text">
                        Безопасность конфиденциальности
                    </p>
                </section>
            )
        }, 
        
    ])

    useEffect(() => setActiveTab(tab || 0), [tab])

    document.title = "Пользовательское сошлашение"
    
    return (
        <RootPage>
            <main className="terms">
                <div className="terms__container container">
                    <aside className="terms__sidebar block">
                        <h1 className="title terms__title">Пользовательское <br /> соглашение</h1>
                        <div className="terms__categories">
                            {
                                tabs.length && tabs.map((tab) => {
                                    return (
                                    <a 
                                        href="#" 
                                        onClick={(e: MouseEvent) => {
                                            e.preventDefault()
                                            setActiveTab(tab.anchor)
                                        }} 
                                        className={`link terms__category ${activeTab === tab.anchor ? 'terms__category_active' : ''} text text_small`}
                                    >
                                        {tab.title}
                                    </a>
                                    )
                                })
                            }
                        </div>
                    </aside>
                    {
                        tabs.length && tabs.map(({anchor, content}) => {
                            return (activeTab || tab) === anchor && content
                        })
                    }
                </div>
            </main>
        </RootPage>
    );
}
 
export default TermsPage;