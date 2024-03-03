import { FC, FormEvent, SetStateAction, useState } from "react";

import StarIcon from "../../assets/images/icons/star_orange.svg";
import EditIcon from "../../assets/images/icons/edit_white.svg";
import CloseIcon from "../../assets/images/icons/close_white.svg";
import CheckIcon from "../../assets/images/icons/check.svg";


import ReviewImg1 from "../../assets/images/img/reviews/1.png";
import ReviewImg2 from "../../assets/images/img/reviews/1.png";
import { ReviewI } from "../../interfaces";
import { getCookie, getData, postData } from "../../services/services";
import FsLightbox from "fslightbox-react";

interface ModeratedReviewPropsI {
    id: number
    username: string
    photo: string
    text: string
    product: string
    images: string[]
    rate: number
    date: string
    order: number
    setAcceptedReviews: React.Dispatch<SetStateAction<ReviewI[]>>
    setUnacceptedReviews: React.Dispatch<SetStateAction<ReviewI[]>>
}
 
const ModeratedReview: FC<ModeratedReviewPropsI> = ({
        id, 
        text, 
        rate, 
        username, 
        photo, 
        date, 
        images, 
        product,
        order, 
        setUnacceptedReviews, 
        setAcceptedReviews
    }) => {
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;
    const [reviewText, setReviewText] = useState<string>(text);
    const [isTextEditable, setIsTextEditable] = useState(false);
    const [toggler, setToggler] = useState<boolean>(false);

    const renderRating = () => {
        const res = [];

        for(let i = 0; i < rate; i++) {
            res.push(<img src={StarIcon} alt="оценка" />)
        }

        return res;
    }

    const acceptReview = async () => {
        await postData(`/review/${id}/accept`, {} ,true)
        .then(async (data) => {
            setAcceptedReviews(data)
        })

        await getData('/reviews/unaccepted', true)
        .then(data => setUnacceptedReviews(data));
    }

    const declineReview = async () => {
        await postData(`/review/${id}/decline`, {} ,true)
        .then(data => setUnacceptedReviews(data))
    }

    const updateReviewData = async () => {
        await fetch(`${baseURL}/reviews/${id}`, {
            headers: {
                "Authorization": 'Bearer ' + getCookie('access_token') as string,
                "Content-Type": "application/json"
            },
            method: "PATCH",
            body: JSON.stringify({
                text: reviewText
            })
        })
    }

    const getValidDate = () => {
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();
    
        return `${day} ${month} ${year}`
    }

    return ( 
        <div className="review block review_moderated reviews__section-item" style={{order}}>
            <div className="review__header">
                <img src={baseURL + '/uploads/' + photo} alt="" className="review__photo" />
                <h5 className="review__name">{username}</h5>
                <div className="review__descision">
                    <span className="review__product">{product}</span>
                    <button onClick={() => acceptReview()} className="admin__btn btn review__descision-btn">
                        Принять
                        <img src={CheckIcon} alt="Принять" />
                    </button>
                    <button onClick={() => declineReview()} className="admin__btn btn btn_orange review__descision-btn">
                        Отклонить
                        <img src={CloseIcon} alt="Отклонить" />
                    </button>
                </div>
            </div>
            <div className="review__images">
                <FsLightbox
                    toggler={toggler}
                    sources={images && [...images.map(img => <img src={baseURL + '/uploads/' + img} alt={`изображение - ${img}`} id={img} />)]}
                ></FsLightbox>
                {
                    images && images.map(img => 
                        <img onClick={() => setToggler(true)} src={baseURL + '/uploads/' + img} alt={`изображение - ${img}`} id={img} className="review__img" />
                    )
                }
            </div>
            <p 
                onInput={(e) => setReviewText((e.target as HTMLInputElement).innerText)} 
                onBlur={(e) => updateReviewData()}
                contentEditable={isTextEditable} 
                className="text text_large review__text"
            >
                {text}
            </p>
            <div className="review__footer">
                <span className="review__date">{getValidDate()}</span>
                <button onClick={() => setIsTextEditable(true)} className="btn review__edit admin__btn">
                    Редактировать текст
                    <img src={EditIcon} alt="редактировать" />
                </button>
                <div className="review__rate">
                    {
                        renderRating()
                    }
                </div>
            </div>
        </div>
     );
}
 
export default ModeratedReview;