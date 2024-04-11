import { FC, FormEvent, ReactNode, useEffect, useState } from "react";

import MsgWhiteIcon from '../../assets/images/icons/msg_white.svg';
import MsgIcon from '../../assets/images/icons/msg.svg';
import StarEmptyIcon from '../../assets/images/icons/star_empty.svg';
import BlueStarIcon from '../../assets/images/icons/star_blue_sharp.svg';
import UploadIcon from '../../assets/images/icons/upload.svg';
import ArrowRightIcon from '../../assets/images/icons/arrow_right_bold.svg'

import Overlay from "../overlay/overlay";

import { postData, uploadFile } from "../../services/services";
import './reviewSender.scss';

interface ReviewSenderPropsI {
    isOpened: boolean
    closeHandler:  React.Dispatch<React.SetStateAction<boolean>>
}

interface ReviewProductI {
    title: string
    order_id: string
    product_id: string
}
 
const ReviewSender: FC<ReviewSenderPropsI> = ({isOpened, closeHandler}) => {
    const [rateArr, setRateArr] = useState<ReactNode>([
        <img onClick={() => setReviewData({...reviewData, rate: 1})} src={StarEmptyIcon} alt="Оцените товар" className="review-sender__star" />,
        <img onClick={() => setReviewData({...reviewData, rate: 2})} src={StarEmptyIcon} alt="Оцените товар" className="review-sender__star" />,
        <img onClick={() => setReviewData({...reviewData, rate: 3})} src={StarEmptyIcon} alt="Оцените товар" className="review-sender__star" />,
        <img onClick={() => setReviewData({...reviewData, rate: 4})} src={StarEmptyIcon} alt="Оцените товар" className="review-sender__star" />,
        <img onClick={() => setReviewData({...reviewData, rate: 5})} src={StarEmptyIcon} alt="Оцените товар" className="review-sender__star" />
    ]);
    const [isProductsListOpened, setIsProductsListOpened] = useState<boolean>(false);
    const [reviewData, setReviewData] = useState({
        rate: 0,
        product: '',
        text: '',
        files: [] as any,
        product_id: '',
        order_id: ''
    });
    const [products, setProducts] = useState([]);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const submitReview = async (e: FormEvent) => {
        e.preventDefault();

        const { rate, product, text, files, order_id, product_id } = reviewData;
        
        if(!rate) {
            setAlertMessage('Поставьте оценку');
            return;
        }

        if(!product.length) {
            setAlertMessage('Выбрите продукт');
            return;
        }

        if(files.length > 3) {
            setAlertMessage('Выберите не более 3-х файлов');
            return;
        }

        const newImages: string[] = [];

        if(files.length) {
            for(let i = 0; i < files.length; i++) {
                await uploadFile(files[i]).then(data => {
                    console.log(data)
                    newImages.push(data.upload)
                });
            }
        }

        console.log(text)

        await postData('/reviews', {
            text,
            images: newImages,
            rate,
            order_id,
            product_id
        }, true)
        .then(data => {
            setAlertMessage('');
            setReviewData({
                rate: 0,
                product: '',
                text: '',
                files: [] as any,
                product_id: '',
                order_id: ''
            });
            closeHandler(false);
        })
    }

    useEffect(() => {
        postData('/reviews/available', {}, true)
        .then(data => setProducts(data));
    }, []);

    useEffect(() => {
        const { rate } = reviewData;
        let newRateArr = [];

        for(let i = 1; i <= rate; i++) {
            newRateArr.push(<img key={BlueStarIcon+i} onClick={() => setReviewData({...reviewData, rate: i})} src={BlueStarIcon} alt="Оцените товар" className="review-sender__star review-sender__star_blue"/>)
        }

        for(let i = rate+1; i <= 5; i++) {
            newRateArr.push(<img key={StarEmptyIcon+i} onClick={() => setReviewData({...reviewData, rate: i})} src={StarEmptyIcon} alt="Оцените товар" className="review-sender__star"/>)
        }

        setRateArr(newRateArr);
    }, [reviewData]);

    useEffect(() => setIsProductsListOpened(false), [reviewData.product])

    return isOpened ? (
        <Overlay closeHandler={closeHandler}>
            <div className="review-sender block">
                <div className="review-sender__header">
                    <img src={MsgIcon} alt="Оставить отзыв" className="review-sender__icon" />
                    <h3 className="title review-sender__title">Оставить отзыв</h3>
                    <h4 className="title review-sender__subtitle">Оцените товар</h4>
                    <div className="review-sender__rate">
                        {rateArr}
                    </div>
                </div>
                <form action="post" className="review-sender__form">
                    <div className="review-sender__select review-sender__widget">
                        Выберите продукт
                        <div onClick={() => setIsProductsListOpened(!isProductsListOpened)} className="review-sender__select-title review-sender__input">
                            {reviewData.product || 'Выберите продукт'}
                            <img 
                                src={ArrowRightIcon} 
                                alt="Выберите продукт" 
                                className={`review-sender__select-icon ${isProductsListOpened && 'review-sender__select-icon_opened'}`}
                            />
                        </div>
                        <ul className={`review-sender__select-list ${isProductsListOpened && 'review-sender__select-list_opened'} list`}>
                            {
                                products.map((product: ReviewProductI) => {
                                    return (
                                        <li 
                                            key={product.product_id}
                                            onClick={e => setReviewData({
                                                ...reviewData, 
                                                product: (e.target as HTMLElement).innerText,
                                                product_id: product.product_id,
                                                order_id: product.order_id
                                            })} 
                                            className="review-sender__select-item"
                                        >{product.title}</li> 
                                    )
                                }) || 'Нет доступных товаров для отзыва'
                            }
                        </ul>
                    </div>
                    <label htmlFor="review-sender-descr" className="review-sender__widget">
                        Описание
                        <input 
                            type="text"
                            onInput={(e) => setReviewData({...reviewData, text: (e.target as HTMLInputElement).value})}
                            id="review-sender-descr" 
                            className="review-sender__input review-sender__block-input"  
                            placeholder="Введите текст"
                        />
                    </label>
                    <label htmlFor="file-sender__input-23134" className="file-sender">
                        <input onInput={e => {
                            setReviewData({
                                ...reviewData,
                                files: (e.target as HTMLInputElement).files
                            })
                        }} type="file" id="file-sender__input-23134" multiple  className="file-sender__input" />
                        <img src={UploadIcon} alt="Прикрепите сюда файлы" />
                        {(reviewData.files.length && Object.keys(reviewData.files).map(key => reviewData.files[key].name + ' ')) || 'Прикрепите сюда файлы'}
                    </label>
                    <div className="review-sender__form-bottom">
                        <span className="text text_small">макс. файлов: 3. Поддерживаемые типы: image</span>
                        <span className="text review-sender__alert">{alertMessage}</span>
                        <div className="review-sender__form-buttons">
                            <a href="#" onClick={() => {
                                document.body.style.overflow = 'initial';
                                document.body.style.height = 'initial';
                                closeHandler(false)
                            }} className="link link_blue link_undecorated">Отмена</a>
                            <button onClick={(e: FormEvent) => submitReview(e)} className="btn review-sender__form-btn">
                                <img src={MsgWhiteIcon} alt="Отправить"/>
                                Оставить отзыв
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Overlay>
    ) : null;
}
 
export default ReviewSender;