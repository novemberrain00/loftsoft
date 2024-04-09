import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import RootPage from "../rootPage/rootPage";
import ReviewSender from "../../components/reviewSender/reviewSender";

import ArrowRounded from "../../assets/images/img/arrow_rounded.png";
import ArrowDownIcon from "../../assets/images/icons/arrow_down.svg";
import SuccessIcon from "../../assets/images/icons/success.svg";
import DownloadIcon from "../../assets/images/icons/download.svg";
import PlusIcon from "../../assets/images/icons/plus.svg";

import StarImg from "../../assets/images/icons/success-star.png";
import QuestionImg from "../../assets/images/icons/question.png";

import { PurchaseI } from "../../interfaces";

import PurchaseItem from "../../components/purchaseItem/purchaseItem";
import { getData } from "../../services/services";

import './successPaymentPage.scss';

interface SuccessPaymentPagePropsI {
    
}
 
const SuccessPaymentPage: FC<SuccessPaymentPagePropsI> = () => {
    const [orderData, setOrderData] = useState<PurchaseI>({} as PurchaseI);
    const [isSenderOpened, setIsSenderOpened] = useState(false);
    const {id} = useParams();

    const { number, result_price, order_data, uri } = orderData;

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    useEffect(() => {
        getData(`/order/${id}/check`, true)
        .then((data: PurchaseI) => setOrderData(data))
    }, []);

    return (
        <RootPage>
            <ReviewSender isOpened={isSenderOpened} closeHandler={setIsSenderOpened}/>
            <main className="success">
                <div className="container success__container">
                    <div className="block success__header">
                        <img src={SuccessIcon} alt="Успешная оплата" className="success__header-icon" />
                        <div className="success__header-info">
                            <div className="success__number">
                                Номер заказа
                                <span className="success__number-value">{number}</span>
                            </div>
                            <h1 className="success__header-title title">Спасибо за покупку!</h1>
                        </div>
                        <img src={ArrowRounded} alt="Спасибо за покупку" className="success__header-img" />
                        {
                            uri ? 
                                <a href={baseURL + '/uploads/' + uri} download className="btn success__header-button">
                                    <img src={DownloadIcon} alt="загрузить" />
                                    Скачать
                                </a> : 
                                <span className="success__header-mark">
                                    <img src={ArrowDownIcon} alt="См. Ниже" />
                                    См. ниже
                                </span>
                        }
                    </div>
                    <div className="block success__products">
                        <h2 className="title success__products-title">Приобретенный товар:</h2>
                        <ul className="list success__products-list">
                            {
                                order_data?.length && order_data.map(({id, title, items, give_type }) => {
                                    return (
                                       <PurchaseItem
                                            id={id}
                                            title={title}
                                            items={items}
                                            give_type={give_type}
                                       />
                                    )
                                })
                            }
                        </ul>
                        <div className="success__products-footer">
                            Итог: { result_price } ₽
                        </div>
                    </div>
                    <div className="success__widgets">
                        <div className="success__widget block">
                            <div className="success__widget-content">
                                <img src={StarImg} alt="скидка" className="success__widget-img"/>
                                <div className="success__widget-text">
                                    <h6 className="success__widget-title">Получите скидку на следующую покупку!</h6>
                                    Для этого оставьте отзыв на купленный товар
                                </div>
                            </div>
                            <button onClick={() => setIsSenderOpened(true)} className="btn success__widget-btn">
                                <img src={PlusIcon} alt="Оставить отзыв"/>
                                Оставить отзыв
                            </button>
                        </div>
                        <div className="success__widget block">
                            <div className="success__widget-content">
                                <img src={QuestionImg} alt="скидка" className="success__widget-img"/>
                                <div className="success__widget-text">
                                    <h6 className="success__widget-title">Политика возврата</h6>
                                    Что делать, если возникли сложности с товаром, или его данные потеряли свою актуальность? Читайте здесь!
                                </div>
                            </div>
                            <Link to="/terms">
                                <button className="btn success__widget-btn">Политика возвратов</button>
                            </Link>
                            
                        </div>
                    </div>
                </div>
            </main>
        </RootPage>
    );
}
 
export default SuccessPaymentPage;