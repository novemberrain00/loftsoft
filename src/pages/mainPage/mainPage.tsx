import {FC, useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';

import RootPage from "../rootPage/rootPage";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Autoplay, Pagination, Navigation } from 'swiper/modules';

import { useClipboard } from 'use-clipboard-copy';

import CopyIcon from '../../assets/images/icons/copy.svg';
import ArrowIcon from '../../assets/images/icons/dropdown-arrow-grey.svg';
import BlueStar from '../../assets/images/icons/star_blue.svg';
import ArrowRight from '../../assets/images/icons/arrow_right.svg';

import Maxon from '../../assets/images/img/top/maxon.jpg';
import Jetbrains from '../../assets/images/img/top/jetbrains.jpg';
import Nanocad from '../../assets/images/img/top/nanocad.jpg';
import TopWindows from '../../assets/images/img/top/windows.jpg';
import Box from '../../assets/images/img/catalog/box.png';
import Bussines from '../../assets/images/img/catalog/bussines.png';
import Graphics from '../../assets/images/img/catalog/graphics.png';
import MSoffice from '../../assets/images/img/catalog/msoffice.png';
import Shield from '../../assets/images/img/catalog/shield.png';
import Windows from '../../assets/images/img/catalog/windows.png';
import LoftsoftImg from '../../assets/images/img/loftsoft.png';
import Puzzle from '../../assets/images/img/puzzle.svg';

import Microsoft from '../../assets/images/img/brands/microsoft.svg';
import Nanosoft from '../../assets/images/img/brands/nanosoft.svg';
import OneC from '../../assets/images/img/brands/1c.svg';
import Adobe from '../../assets/images/img/brands/adobe.svg';
import Ascon from '../../assets/images/img/brands/ascon.svg';
import Autodesk from '../../assets/images/img/brands/autodesk.svg';
import Basealt from '../../assets/images/img/brands/basealt.svg';
import BIM from '../../assets/images/img/brands/bim.svg';
import JetbrainsPartners from '../../assets/images/img/brands/jetbrains.svg';
import Kaspersky from '../../assets/images/img/brands/kaspersky.svg';
import MaxonPartners from '../../assets/images/img/brands/maxon.svg';
import MWB from '../../assets/images/img/brands/mwb.svg';
import SC from '../../assets/images/img/brands/sc.svg';

import ReviewImg1 from '../../assets/images/img/reviews/1.png';
import ReviewImg2 from '../../assets/images/img/reviews/2.png';
import ReviewImg3 from '../../assets/images/img/reviews/3.png';

import Slide1 from '../../assets/images/img/carousel/slide1.png';
import Slide2 from '../../assets/images/img/carousel/slide2.png';
import Slide3 from '../../assets/images/img/carousel/slide3.png';
import Slide1Mobile from '../../assets/images/img/carousel/slide1-mobile.png';


import Loader from "../../components/loader/loader";
import Product from "../../components/product/product";
import Review from "../../components/review/review";

import { CategoryI, ReviewI } from "../../interfaces";
import { convertToLatin, getData } from "../../services/services";

import { addSnack } from "../../redux/snackbarSlice";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';

import '../../lib/swiper/swiper.scss';
import './mainPage.scss';


interface MainPageProps {
    
}
 
const MainPage: FC<MainPageProps> = () => {
    const dispatch = useDispatch();
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const [categories, setCategories] = useState<CategoryI[]>([]);
    const [reviews, setReviews] = useState<ReviewI[]>([]);

    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
          return '<span class="' + className + '"></span>';
        },
      };

    const clipboard = useClipboard({
        onSuccess: () => {
            dispatch(addSnack({text: 'Скопировано'}))
        }
    });

    useEffect(() => {
        getData('/categories?empty_filter=true')
        .then(data => setCategories(data));

        getData('/reviews')
        .then(data => setReviews(data));
    }, [])

    return (
        <RootPage>
            <main className='content'>
                <div className="container content__container">
                    <div className="promo desktop-grid">
                        <div className="promo__left">
                            <div className="block banner banner_main">
                                <h1 className="title banner__title">МАГАЗИН <span className="banner__title banner__title_marked">ЛИЦЕНЗИОННОГО ПО</span></h1>
                                <p className="banner__text text">
                                    LOFTSOFT - это уникальное решение для каждого, кто хочет пользоваться сервисами так, как это было задумано, без региональных блокировок. 
                                    <br />
                                    <br />
                                    Выбирай лучшее - выбирай LOFTSOFT
                                </p>
                                <div className="discount promo__discount">
                                    <label onClick={clipboard.copy} htmlFor="discount-input" className="discount__input-label">
                                        <input type="text" ref={clipboard.target} value="OPENSOFT23" placeholder="OPENSOFT23" className="discount__input" id="discount-input" readOnly/>
                                        <img src={CopyIcon} alt="скопировать" className="discount__icon"/>
                                    </label>
                                    <span className="discount-value">-5%</span>
                                    <p className="discount__text text">
                                        Скидка новым пользователям в честь открытия лучшего в магазина лицензионных программ
                                    </p>
                                </div>
                            </div>
                            <section className="promo__catalog" id="promo__catalog">
                                <h2 className="title title_grey">КАТАЛОГ</h2>
                                <h3 className="promo__catalog-subtitle subtitle">Тут можно найти много всего интересного</h3>
                                <div className="promo__catalog-items">
                                { categories.length ? categories.map(({title, photo, subcategories, id}, i) => {
                                        const catTitle = title;
                                        return (
                                        <div key={id} className="promo__catalog-item block">
                                            <div>
                                                <img src={baseURL + '/uploads/' + photo} alt={catTitle} className="promo__catalog-img"/>
                                            </div>
                                            <div className="promo__catalog-info">
                                                <h4 className="title promo__catalog-title">{catTitle}</h4>
                                                <div className="promo__catalog-products">
                                                    {
                                                        subcategories.map(({id, title}, i) => {
                                                            return <Link key={id} to={`/catalog/${id}`}>
                                                                <span  className="link promo__catalog-product">{title}</span>
                                                            </Link>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <img src={ArrowIcon} alt="открыть" className="promo__catalog-icon" />
                                        </div>
                                        )
                                    }) : <Loader additionalClass="promo__catalog-loader"/> 
                                } 
                                </div>
                            </section>
                        </div>
                        <div className="promo__right">
                            <div className="block banner promo__right-banner">
                                <h2 className="banner__title title">WINDOWS 11</h2>
                                <h3 className="subtitle subtitle_black">Обновитесь уже сейчас!</h3>
                                <div className="sale">
                                    <button className="btn sale__btn">Перейти</button>
                                    <div className="discount-value sale__value">-40%</div>
                                </div>
                            </div>
                            <div className=" block promo__advantages">
                                <h2 className="title promo__advantages-title">НАШИ ПРЕИМУЩЕСТВА</h2>
                                <h3 className="subtitle promo__advantages-subtitle">Перед конкурентами</h3>
                                <div>
                                    <Swiper
                                        pagination={pagination}
                                        modules={[Autoplay, Pagination]}
                                        autoplay={{
                                            delay: 1200,
                                            disableOnInteraction: false,
                                        }}
                                        className="promo__advantages-carousel carousel"
                                    >
                                        <SwiperSlide>
                                            <div className="promo__advantages-slide carousel__slide">
                                                <img src={Slide1} alt="техническая поддержка 24/7" className="promo__advantages-img" />
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="promo__advantages-slide carousel__slide">
                                                <img src={Slide2} alt="ЗАКАЗ ЛЮБОГО СОФТА ЧЕРЕЗ ОДНУ КНОПКУ" className="promo__advantages-img" />
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="promo__advantages-slide carousel__slide">
                                                <img src={Slide3} alt="ИМЕЕМ ОТЗЫВЫ НА ДРУГИХ ПЛОЩАДКАХ" className="promo__advantages-img" />
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="promo mobile-block">
                        <div className="block banner banner_main">
                            <h1 className="title banner__title banner__title_main">МАГАЗИН <span className="banner__title banner__title_marked">ЛИЦЕНЗИОННОГО ПО</span></h1>
                            <p className="banner__text text">
                                LOFTSOFT - это уникальное решение для каждого, кто хочет пользоваться сервисами так, как это было задумано, без региональных блокировок. 
                                <br />
                                <br />
                                Выбирай лучшее - выбирай LOFTSOFT
                            </p>
                            <div className="discount promo__discount">
                                <label onClick={clipboard.copy} htmlFor="discount-input" className="discount__input-label">
                                    <input type="text" ref={clipboard.target} value="OPENSOFT23" placeholder="OPENSOFT23" className="discount__input" id="discount-input" readOnly/>
                                    <img src={CopyIcon} alt="скопировать" className="discount__icon"/>
                                </label>
                                <span className="discount-value">-5%</span>
                                <p className="discount__text text">
                                    Скидка новым пользователям в честь открытия лучшего в магазина лицензионных программ
                                </p>
                            </div>
                        </div>
                        <div className="promo__right">
                            <div className="block banner promo__right-banner">
                                <h2 className="banner__title title">WINDOWS 11</h2>
                                <h3 className="promo__right-subtitle subtitle subtitle_black">Обновитесь уже сейчас!</h3>
                                <div className="sale">
                                    <button className="btn sale__btn">Перейти</button>
                                    <div className="discount-value sale__value">-40%</div>
                                </div>
                            </div>
                            <div className="block promo__advantages">
                                <h2 className="title promo__advantages-title">НАШИ ПРЕИМУЩЕСТВА</h2>
                                <h3 className="subtitle promo__advantages-subtitle">Перед конкурентами</h3>
                                <img src={Slide1Mobile} alt="ТЕХНИЧЕСКАЯ ПОДДЕРЖКА РАБОТАЕТ 24/7" className="promo__advantages-img" />
                            </div>
                        </div>
                        <section className="promo__catalog" id="promo__catalog">
                            <h2 className="title title_grey">КАТАЛОГ</h2>
                            <h3 className="promo__catalog-subtitle subtitle">Тут можно найти много всего интересного</h3>
                            <div className="promo__catalog-items">
                                {categories.length ? categories.map(({id, title, photo, subcategories}, i) => {
                                        const catTitle = title;
                                        return (
                                        <div key={id} className="promo__catalog-item block">
                                            <div>
                                                <img src={baseURL + '/uploads/' + photo} alt={catTitle} className="promo__catalog-img"/>
                                            </div>
                                            <div className="promo__catalog-info">
                                                <h4 className="title promo__catalog-title">{catTitle}</h4>
                                                <div className="promo__catalog-products">
                                                    {
                                                        subcategories.map(({id, title}, i) => {
                                                            return <Link key={id} to={`/catalog/${convertToLatin(catTitle)}`}>
                                                                <span  className="link promo__catalog-product">{title}</span>
                                                            </Link>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <img src={ArrowIcon} alt="открыть" className="promo__catalog-icon" />
                                        </div>
                                        )
                                    }) : <Loader/> 
                                }
                                </div>
                        </section>
                    </div>
                    <section className="top">
                        <div className="top__header">
                            <h2 className="title title_grey top__title">ПОПУЛЯРНЫЕ ТОВАРЫ</h2>
                            <h3 className="subtitle">На сайте</h3>
                        </div>
                        <div className="top__items">
                        </div>
                    </section>
                </div>
                <section className="partners content__partners">
                        <div className="container content__container">
                            <h2 className="title title_grey">НАШИ ПОСТАВЩИКИ</h2>
                            <h3 className="subtitle">Более трёх лет</h3>
                        </div>
                        <div className="partners__carousel">
                            <div className="partners__carousel-track">
                               <img src={Microsoft} alt="microsoft" className="partners__carousel-slide" />
                               <img src={Autodesk} alt="autodesk" className="partners__carousel-slide" />
                               <img src={Adobe} alt="adobe" className="partners__carousel-slide" />
                               <img src={MaxonPartners} alt="maxon" className="partners__carousel-slide" />
                               <img src={Nanosoft} alt="nanosoft" className="partners__carousel-slide" />
                               <img src={Kaspersky} alt="kaspersky" className="partners__carousel-slide" />
                               <img src={BIM} alt="BIM" className="partners__carousel-slide" />
                               <img src={MWB} alt="malwarebytes" className="partners__carousel-slide" />
                               <img src={JetbrainsPartners} alt="Jetbrains" className="partners__carousel-slide" />
                               <img src={Basealt} alt="basealt" className="partners__carousel-slide" />
                               <img src={OneC} alt="1c" className="partners__carousel-slide" />
                               <img src={SC} alt="security code" className="partners__carousel-slide" />
                               <img src={Ascon} alt="ascon" className="partners__carousel-slide" />
                               <img src={Microsoft} alt="microsoft" className="partners__carousel-slide" />
                               <img src={Autodesk} alt="autodesk" className="partners__carousel-slide" />
                               <img src={Adobe} alt="adobe" className="partners__carousel-slide" />
                               <img src={MaxonPartners} alt="maxon" className="partners__carousel-slide" />
                               <img src={Nanosoft} alt="nanosoft" className="partners__carousel-slide" />
                               <img src={Kaspersky} alt="kaspersky" className="partners__carousel-slide" />
                               <img src={BIM} alt="BIM" className="partners__carousel-slide" />
                               <img src={MWB} alt="malwarebytes" className="partners__carousel-slide" />
                               <img src={JetbrainsPartners} alt="Jetbrains" className="partners__carousel-slide" />
                               <img src={Basealt} alt="basealt" className="partners__carousel-slide" />
                               <img src={OneC} alt="1c" className="partners__carousel-slide" />
                               <img src={SC} alt="security code" className="partners__carousel-slide" />
                               <img src={Ascon} alt="ascon" className="partners__carousel-slide" />
                            </div>
                        </div>
                </section>
                <div className="reviews content__reviews">
                    <div className="reviews__header container content__container">
                        <div className="reviews__rate">
                            5.00
                            <div className="reviews__rate-stars">
                                <img src={BlueStar} alt="звезда" className="reviews__rate-star" />
                                <img src={BlueStar} alt="звезда" className="reviews__rate-star" />
                                <img src={BlueStar} alt="звезда" className="reviews__rate-star" />
                                <img src={BlueStar} alt="звезда" className="reviews__rate-star" />
                                <img src={BlueStar} alt="звезда" className="reviews__rate-star" />
                            </div>
                        </div>
                        <h4 className="title reviews__header-title">Отзывы клиентов</h4>
                        <div className="reviews__items-header">
                            {reviews.length > 300 ?  `> 300 отзывов` : `${reviews.length} отзывов`} 
                            <span>10 последних отзывов</span>
                        </div>
                    </div>
                    <Swiper
                            slidesPerView={2}
                            spaceBetween={20}
                            breakpoints={{
                                1280: {
                                    slidesPerView: 2
                                }
                            }}
                            navigation={true}
                            scrollbar={{
                                hide: false
                            }}
                            onInit={(swiper: any) => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                                swiper.params.scrollbar.draggable = true;
                                swiper.navigation.init();
                                swiper.navigation.update();
                              }}
                            modules={[Navigation, Scrollbar]}
                            className="reviews__items"
                        >
                            {
                                reviews && reviews.map(({id, product, user, user_photo, rate, text, images, created_datetime}, i) => {
                                    return (
                                        <SwiperSlide>
                                            <Review 
                                                key={id}
                                                id={id}
                                                product={product}
                                                user_photo={user_photo}
                                                user={user}
                                                text={text}
                                                created_datetime={created_datetime}
                                                images={images}
                                                additionalClass="review_rotated content__review"
                                                rate={rate}
                                            />
                                        </SwiperSlide>
                                    )
                                })
                            }
                    </Swiper>
                    <div className="reviews__bottom container content__container">
                        <Link to="/reviews">
                            <button className="btn btn_large reviews__btn">
                                Посмотреть все отзывы
                                <img src={ArrowRight} alt="Посмотреть все товары" className="btn_large-icon" />
                            </button>
                        </Link>
                        <div className="reviews__bottom-buttons">
                            <button className="reviews__bottom-button btn" ref={prevRef}>
                                <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="ep:arrow-up-bold">
                                    <path id="Vector" d="M11.9093 3.78303C11.4875 4.21668 11.2505 4.80477 11.2505 5.41796C11.2505 6.03116 11.4875 6.61924 11.9093 7.0529L23.0468 18.4998L11.9093 29.9467C11.4994 30.3828 11.2726 30.9669 11.2777 31.5733C11.2829 32.1796 11.5195 32.7596 11.9367 33.1884C12.3538 33.6171 12.9182 33.8603 13.5081 33.8656C14.0981 33.8709 14.6664 33.6378 15.0908 33.2165L27.819 20.1347C28.2408 19.7011 28.4778 19.113 28.4778 18.4998C28.4778 17.8866 28.2408 17.2985 27.819 16.8648L15.0908 3.78303C14.6688 3.3495 14.0966 3.10596 13.5 3.10596C12.9034 3.10596 12.3312 3.3495 11.9093 3.78303Z" fill="white" fill-opacity="0.7"/>
                                    </g>    
                                </svg>
                            </button>
                            <button className="reviews__bottom-button btn" ref={nextRef}>
                                <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="ep:arrow-up-bold">
                                    <path id="Vector" d="M11.9093 3.78303C11.4875 4.21668 11.2505 4.80477 11.2505 5.41796C11.2505 6.03116 11.4875 6.61924 11.9093 7.0529L23.0468 18.4998L11.9093 29.9467C11.4994 30.3828 11.2726 30.9669 11.2777 31.5733C11.2829 32.1796 11.5195 32.7596 11.9367 33.1884C12.3538 33.6171 12.9182 33.8603 13.5081 33.8656C14.0981 33.8709 14.6664 33.6378 15.0908 33.2165L27.819 20.1347C28.2408 19.7011 28.4778 19.113 28.4778 18.4998C28.4778 17.8866 28.2408 17.2985 27.819 16.8648L15.0908 3.78303C14.6688 3.3495 14.0966 3.10596 13.5 3.10596C12.9034 3.10596 12.3312 3.3495 11.9093 3.78303Z" fill="white" fill-opacity="0.7"/>
                                    </g>    
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="desktop-grid promo2 container content__container">
                    <img src={LoftsoftImg} alt="loftsoft" className="promo2__img" />
                    <div className="promo2__delivery">
                        <h5 className="title title_small promo2__title">Быстрая доставка купленного товара на почту</h5>
                        <p className="text text_large promo2__text">
                            Вы получаете свой товар максимально быстро на указанную вами почту при покупке. Это позволяет вам как клиенту, не теряя ни минуты, приступить к использованию приобретенной лицензии.
                        </p>
                        <button 
                            onClick={() => {
                                const catalogBlock = document.querySelector('#promo__catalog');
                                if (catalogBlock) {
                                    catalogBlock.scrollIntoView({ behavior: "smooth" });
                                }
                            }} 
                            className="btn btn_large promo2__btn"
                        >
                            Перейти&nbsp;в&nbsp;каталог
                            <img src={ArrowRight} alt="Посмотреть все товары" className="btn_large-icon" />
                        </button>
                    </div>
                    <div className="promo2__coop">
                        <img src={Puzzle} alt="loftsoft" className="promo2__img" />
                        <h5 className="title title_small promo2__title">Сотрудничество напрямую с вендорами</h5>
                        <p className="text text_large promo2__text">
                            Мы сотрудничаем напрямую с ведущими мировыми вендорами, такими как Microsoft, Maxon, Nanosoft и другими.
                        </p>
                    </div>
                </div>
                <div className="mobile-flex promo2 container content__container">
                    <img src={LoftsoftImg} alt="loftsoft" className="promo2__img" />
                    <div className="promo2__delivery">
                        <h5 className="title title_small promo2__title">Быстрая доставка купленного товара на почту</h5>
                        <p className="text promo2__text">
                            Вы получаете свой товар максимально быстро на указанную вами почту при покупке. Это позволяет вам как клиенту, не теряя ни минуты, приступить к использованию приобретенной лицензии.
                        </p>
                    </div>
                    <div className="promo2__bottom">
                        <div className="promo2__bottom-left">
                            <img src={Puzzle} alt="loftsoft" className="promo2__img" />
                            <button 
                                onClick={() => {
                                    const catalogBlock = document.querySelector('#promo__catalog');
                                    if (catalogBlock) {
                                        catalogBlock.scrollIntoView({ behavior: "smooth" });
                                    }
                                }} className="btn btn_large promo2__btn"
                            >
                                Перейти&nbsp;в&nbsp;каталог
                                <img src={ArrowRight} alt="Посмотреть все товары" className="btn_large-icon" />
                            </button>
                        </div>
                        <div className="promo2__coop">
                            <h5 className="title title_small promo2__title promo2__coop-title">Сотрудничество напрямую с вендорами</h5>
                            <p className="text promo2__text promo2__coop-text">
                                Мы сотрудничаем напрямую с ведущими мировыми вендорами, такими как Microsoft, Maxon, Nanosoft и другими.
                            </p>
                        </div>
                    </div>
                    
                </div>
            </main>
        </RootPage>
    );
}
 
export default MainPage;