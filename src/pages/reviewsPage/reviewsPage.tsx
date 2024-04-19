import { FC, useContext, useEffect, useState } from "react";
import RootPage from "../rootPage/rootPage";

import BlueStarIcon from '../../assets/images/icons/star_blue_sharp.svg';
import PlusIcon from '../../assets/images/icons/plus.svg';

import Review from "../../components/review/review";
import ReviewSender from "../../components/reviewSender/reviewSender";

import { ReviewsContext } from "../../context";
import './reviewsPage.scss';

interface ReviewsPagePropsI {
    
}
 
const ReviewsPage: FC<ReviewsPagePropsI> = () => {
    const [isSenderOpened, setIsSenderOpened] = useState(false);

    const reviews = useContext(ReviewsContext);

    document.title = "Отзывы";

    return (
        <RootPage>
            <ReviewSender isOpened={isSenderOpened} closeHandler={setIsSenderOpened}/>
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
                            <span className="reviews__amount">{reviews.length} отзывов</span>
                            <button onClick={() => setIsSenderOpened(true)} className="btn reviews__rating-btn">
                                <img src={PlusIcon} alt="Оставить свой отзыв" />
                                Оставить свой отзыв
                            </button>
                        </div>
                    </div>
                    <div className="reviews__wrapper block">
                        <h2 className="reviews__wrapper-title">
                            {
                                reviews.length > 300 ? '&gt;300 отзывов' : `${reviews.length} отзывов`
                            }
                        </h2>
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