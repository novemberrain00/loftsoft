import { FC, useState } from "react";

import BlueStarIcon from '../../assets/images/icons/star_blue.svg';
import { ReviewI } from "../../interfaces";

import './review.scss';
import FsLightbox from "fslightbox-react";

 
const Review: FC<ReviewI> = ({user, user_photo, product, images, text, created_datetime, rate, additionalClass}) => {
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;
    const [toggler, setToggler] = useState<boolean>(false);

    const renderStars = () => {
        const res = [];
    
        for(let i = 0; i < rate; i++) {
            res.push(<img src={BlueStarIcon} alt="star" className="review__star"/>)
        }

        return res;
    };

    const getValidDate = () => {
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
        const dateObj = new Date(created_datetime);
        const day = dateObj.getDate();
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();
    
        return `${day} ${month} ${year}`
    }

    return (
        <>
        
        <div className={`review block ${additionalClass || ''}`}>
            <FsLightbox 
                    toggler={toggler}
                    sources={images && [...images.map(img => <img src={baseURL + '/uploads/' + img} alt={`изображение - ${img}`} id={img} />)]}
                ></FsLightbox>
            <div className="review__header">
                <img src={baseURL + '/uploads/' + user_photo} alt="" className="review__photo" />
                <h5 className="review__name">{user}</h5>
                <span className="review__product">{product}</span>
            </div>
            <div className="review__images">
                {
                    images && images.map(img => 
                        <img onClick={() => setToggler(!toggler)} src={baseURL + '/uploads/' + img} alt={`изображение - ${img}`} id={img} className="review__img" />
                    )
                }
            </div>
            <p className="text text_large review__text">
                {text}
            </p>
            <div className="review__footer">
                <span className="review__date">{getValidDate()}</span>
                <div className="review__rate">
                    {
                        renderStars()
                    }
                </div>
            </div>
        </div>
        </>
    );
}
 
export default Review;