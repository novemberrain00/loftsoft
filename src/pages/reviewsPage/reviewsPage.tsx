import { FC, useEffect, useState } from "react";
import RootPage from "../rootPage/rootPage";

import BlueStarIcon from '../../assets/images/icons/star_blue_sharp.svg';
import PlusIcon from '../../assets/images/icons/plus.svg';

import ReviewImg1 from '../../assets/images/img/reviews/1.png';
import ReviewImg2 from '../../assets/images/img/reviews/2.png';
import ReviewImg3 from '../../assets/images/img/reviews/3.png';

import Review from "../../components/review/review";
import ReviewSender from "../../components/reviewSender/reviewSender";
import Overlay from "../../components/overlay/overlay";

import './reviewsPage.scss';
import { getData } from "../../services/services";

interface ReviewsPagePropsI {
    
}
 
const ReviewsPage: FC<ReviewsPagePropsI> = () => {
    const [isSenderOpened, setIsSenderOpened] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        getData('/reviews')
        .then(data => setReviews(data))
    }, [])

    return (
        <RootPage>
            {
                isSenderOpened && <Overlay closeHandler={setIsSenderOpened}>
                    <ReviewSender closeHandler={setIsSenderOpened}/>
                </Overlay>
            }
            <main className="reviews">
                <div className="container reviews__container">
                    <div className="reviews__rating block">
                        <h1 className="title reviews__rating-title">Рейтинг магазина</h1>
                        <div className="reviews__rating-body">
                            <span className="reviews__rating-rate">5.00</span>
                            <div className="reviews__rating-stars">
                                <img src={BlueStarIcon} alt="рейтинг" className="reviews__rating-star" />
                                <img src={BlueStarIcon} alt="рейтинг" className="reviews__rating-star" />
                                <img src={BlueStarIcon} alt="рейтинг" className="reviews__rating-star" />
                                <img src={BlueStarIcon} alt="рейтинг" className="reviews__rating-star" />
                                <img src={BlueStarIcon} alt="рейтинг" className="reviews__rating-star" />
                            </div>
                            <span className="reviews__amount">11948 отзывов</span>
                            <button onClick={() => setIsSenderOpened(true)} className="btn reviews__rating-btn">
                                <img src={PlusIcon} alt="Оставить свой отзыв" />
                                Оставить свой отзыв
                            </button>
                        </div>
                    </div>
                    <div className="reviews__wrapper block">
                        <h2 className="reviews__wrapper-title">&gt;300 отзывов</h2>
                        <div className="reviews__wrapper-items">
                            {
                                reviews.map(({id, user, user_photo, rate, text, images, product, created_datetime}) => {
                                    return (
                                        <Review
                                            key={id}
                                            id={id}
                                            user={user}
                                            user_photo={user_photo}
                                            rate={rate}
                                            text={text}
                                            product={product}
                                            created_datetime={created_datetime}
                                            images={images}
                                        /> 
                                    )
                                })
                            }
                        </div>
                        <div className="reviews__wrapper-shadow"></div>
                    </div>
                </div>
            </main>
        </RootPage>
    );
}
 
export default ReviewsPage;