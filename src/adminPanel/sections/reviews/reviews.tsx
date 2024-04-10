import { FC, useEffect, useState } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import StarIcon from "../../../assets/images/icons/star_orange.svg";
import TrashIcon from '../../../assets/images/icons/trash.svg';

import { getData, postData } from "../../../services/services";
import ModeratedReview from "../../../components/moderatedReview/moderatedReview";
import { ReviewI } from "../../../interfaces";
import FsLightbox from "fslightbox-react";
import './reviews.scss';

interface ReviewsPropsI {
    
}
 
const Reviews: FC<ReviewsPropsI> = () => {
    const [unacceptedReviews, setUnacceptedReviews] = useState<ReviewI[]>([]);
    const [acceptedReviews, setAcceptedReviews] = useState<ReviewI[]>([]);
    const [toggler, setToggler] = useState<boolean>(false);

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const renderStars = (rate: number) => {
        const res = [];
        
        for(let i = 0; i < rate; i++) {
            res.push(<img src={StarIcon} alt="star" className="review__star"/>)
        }

        return res;
    };

    const deleteReview = async (id: number) => {
        await postData(`/review/${id}/decline`, {}, true);

        await getData('/reviews')
        .then(data => setAcceptedReviews(data));
    }

    const getValidDate = (date: string) => {
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();
    
        return `${day} ${month} ${year}`
    }

    useEffect(() => {
        getData('/reviews/unaccepted', true)
        .then(data => setUnacceptedReviews(data))

        getData('/reviews')
        .then(data => setAcceptedReviews(data))
    }, []);

    return (
        <>
            <AdminHeader title="Отзывы"></AdminHeader>
            <div className="reviews">
                <div className="reviews__section">
                    <h2 className="reviews__section-title">На модерации</h2>
                    <div className="reviews__section-items">
                        {
                            unacceptedReviews && unacceptedReviews.map(({id, text, rate, user, user_photo, product, created_datetime, images}, i) => {
                                return (
                                    <ModeratedReview
                                        key={id}
                                        id={id}
                                        order={unacceptedReviews.length - i}
                                        text={text}
                                        rate={rate}
                                        username={user}
                                        photo={user_photo}
                                        product={product}
                                        date={created_datetime}
                                        images={images}
                                        setAcceptedReviews={setAcceptedReviews}
                                        setUnacceptedReviews={setUnacceptedReviews}
                                    /> 
                                )
                            })
                        }
                    </div>
                </div>
                <div className="reviews__section">
                    <h2 className="reviews__section-title">Опубликованные отзывы</h2>
                    <div className="reviews__section-items">
                        {
                            acceptedReviews && acceptedReviews.map(({id, product, user, text, user_photo, created_datetime, rate, images}, i) => {
                                return (
                                    <div className='review block reviews__section-item' style={{order: acceptedReviews.length - i}}>
                                        <div className="review__header">
                                            <img src={baseURL + '/uploads/' + user_photo} alt="" className="review__photo" />
                                            <h5 className="review__name">{user}</h5>
                                            <span className="review__product">{product}</span>
                                            <button className="review__helper" onClick={() => deleteReview(id)}>
                                                <img src={TrashIcon} alt="удалить отзыв" className="review__helper-icon" />
                                            </button>
                                        </div>
                                        <div className="review__images">
                                            {/* <FsLightbox
                                                toggler={toggler}
                                                sources={images && [...images.map(img => <img src={baseURL + '/uploads/' + img} alt={`изображение - ${img}`} id={img} />)]}
                                            ></FsLightbox> */}
                                            {
                                                images && images.map(img => 
                                                    <img onClick={() => setToggler(true)} src={baseURL + '/uploads/' + img} alt={`изображение - ${img}`} id={img} className="review__img" />
                                                )
                                            }
                                        </div>
                                        <p className="text text_large review__text">
                                            {text}
                                        </p>
                                        <div className="review__footer">
                                            <span className="review__date">{getValidDate(created_datetime)}</span>
                                            <div className="review__rate">
                                                {
                                                    renderStars(rate)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Reviews;