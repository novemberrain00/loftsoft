import { FC, useState } from "react";

import RootPage from "../rootPage/rootPage";

import ArrowRounded from "../../assets/images/img/arrow_rounded.png";
import SuccessIcon from "../../assets/images/icons/success.svg";
import DownloadIcon from "../../assets/images/icons/download.svg";
import DownloadBlueIcon from "../../assets/images/icons/download_blue.svg";
import Copy2Icon from "../../assets/images/icons/copy-2.svg";
import PlusIcon from "../../assets/images/icons/plus_squared.svg";
import Windows from '../../assets/images/img/catalog/windows.png';

import './successPaymentPage.scss';
import { OrderI } from "../../interfaces";
import { useParams } from "react-router-dom";
import { getData } from "../../services/services";

interface SuccessPaymentPagePropsI {
    
}
 
const SuccessPaymentPage: FC<SuccessPaymentPagePropsI> = () => {
    const [orderData, setOrderData] = useState<OrderI>({} as OrderI);
    const { id } = useParams();

    // useEffect(() => {
    //     getData()
    // }, [id])

    return (
        <RootPage>
            <main className="success">
                <div className="container success__container">
                    <div className="block success__header">
                        <img src={SuccessIcon} alt="Успешная оплата" className="success__header-icon" />
                        <div className="success__header-info">
                            <div className="success__number">
                                Номер заказа
                                <span className="success__number-value">#3441512</span>
                            </div>
                            <h1 className="success__header-title title">Спасибо за покупку!</h1>
                        </div>
                        <img src={ArrowRounded} alt="Спасибо за покупку" className="success__header-img" />
                        <button className="btn success__header-button">
                            <img src={DownloadIcon} alt="загрузить" />
                            Скачать
                        </button>
                    </div>
                    <div className="block success__products">
                        <h2 className="title success__products-title">Приобретенный товар:</h2>
                        <ul className="list success__products-list">
                            <li className="success__products-item">
                                <img src={Windows} alt="Лицензионный ключ Windows 10 Professional" className="success__products-img" />
                                <h6 className="success__products-name title">Лицензионный ключ Windows 10 Professional</h6>
                                <span className="desktop-block success__products-char">
                                    249 руб.
                                </span>
                                <span className="desktop-block success__products-char">
                                    1 шт.
                                </span>
                                <span className="success__products-char success__products-char_rounded">
                                    <img src={Copy2Icon} alt="Лицензионный ключ Windows 10 Professional"/>
                                </span>
                                <span className="success__products-char success__products-char_rounded">
                                    <img src={DownloadBlueIcon} alt="Лицензионный ключ Windows 10 Professional"/>
                                </span>
                            </li>
                        </ul>
                        <button className="success__btn btn">
                            <img src={PlusIcon} alt="Оставить отзыв" className="success__btn-squared" />
                            Оставить отзыв
                        </button>
                    </div>
                </div>
            </main>
        </RootPage>
    );
}
 
export default SuccessPaymentPage;