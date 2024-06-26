import { FC, useEffect, useState } from "react";
import FsLightbox from "fslightbox-react";
import { useParams } from "react-router-dom";

import RootPage from "../rootPage/rootPage";
import Path from "../../components/path/path";

import BlueStar from '../../assets/images/icons/star_blue.svg';

import { convertToLatin, getData, getSlug } from "../../services/services";

import { ProductI, SubcategoryI } from "../../interfaces";
import Parameter from "../../components/parameter/parameter";

import BuyPopup from "../../components/buyPopup/buyPopup";
import './productPage.scss';

interface ProductPagePropsI {
    id: number
}
 
const ProductPage: FC<ProductPagePropsI> = () => {
    const [productData, setProductData] = useState<ProductI>({} as ProductI);
    const [toggler, setToggler] = useState<boolean>(false);
    const [subcategories, setSubcategories] = useState<SubcategoryI[]>([]);
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [isBuyPopupOpened, setIsBuyPopupOpened] = useState<boolean>(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(1);

    const { subcategorySlug } = useParams();
    const subcategoryId = subcategories.filter(async (subcat: SubcategoryI) => {
        return await getSlug('subcategory', subcat.id) === subcategorySlug
    })[0].id;

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    useEffect(() => {
        const getProductData = async () => {
            await getData(`/subcategories`)
            .then(data => setSubcategories(data));

            await getData(`/product/${id}`)
            .then(data => setProductData(data));

            await getData(`/subcategory/${subcategoryId}`)
            .then(data => {
                setSubcategoryName(data.title);
            })
        }

        getProductData();
    }, []);

    const {
        id,
        title,
        parameters,
        options,
        description,
        product_photos,
    } = productData;

    document.title = title;

    return (
        <>
            <RootPage>
                <main className="product-page">
                    <div className="container product-page__top">
                        <Path links={[
                            {
                                text: 'Главная',
                                path: '/'
                            },
                            {
                                text: 'Каталог',
                                path: '/catalog'
                            },
                            {
                                text: subcategoryName,
                                path: `/catalog/${subcategorySlug}`
                            },
                            {
                                text: title,
                                path: ''
                            },
                        ]}/>
                    </div>
                    <div className="container product-page__container">
                        <div className="product-page__gallery">
                            <div onClick={() => setToggler(!toggler)} className="product-page__gallery_animated product-page__gallery-active">
                                {
                                    product_photos && 
                                        <img 
                                            src={baseURL + '/uploads/' + product_photos[0]?.photo} 
                                            alt={title} 
                                            onClick={() => setActiveSlideIndex(1)} 
                                            className="product-page__gallery-item" 
                                        />
                                }
                            </div>
                            <div className="product-page__gallery-items">
                                <FsLightbox
                                    toggler={toggler}
                                    slide={activeSlideIndex}
                                    sources={product_photos && [...product_photos.map((photo, i) => {
                                        return <img 
                                            key={photo.photo}
                                            src={baseURL + '/uploads/' + photo.photo} 
                                            alt={title} className="product-page__gallery-item" 
                                        />
                                    })]}
                                />
                                {product_photos && product_photos.slice(1).map((photo, i) => {
                                    return <img 
                                        key={photo.photo}
                                        src={baseURL + '/uploads/' + photo.photo} 
                                        alt={title} className="product-page__gallery-item" 
                                        onClick={() => {
                                            setActiveSlideIndex(i+2)
                                            setToggler(!toggler)
                                        }}
                                    />
                                })}
                            </div>
                        </div>
                        <div className="product-page__info">
                            <h1 className="product-page__title title">{title}</h1>
                            <div className="product-page__rate">
                                5.0
                                <div className="product-page__rate-stars">
                                    <img src={BlueStar} alt="rate" className="product-page__rate-star" />
                                    <img src={BlueStar} alt="rate" className="product-page__rate-star" />
                                    <img src={BlueStar} alt="rate" className="product-page__rate-star" />
                                    <img src={BlueStar} alt="rate" className="product-page__rate-star" />
                                    <img src={BlueStar} alt="rate" className="product-page__rate-star" />
                                </div>
                            </div>
                            <section className="product-page__section">
                                <h3 className="product-page__section-title title title_small">Описание</h3>
                                <p className="product-page__text text">
                                    {description}
                                </p>
                            </section>
                            <section className="product-page__section">
                                <h3 className="product-page__section-title title title_small">Характеристики</h3>
                                <div className="product-page__chars">
                                    <div className="product-page__char text">
                                        <span className="product-page__char-name">Код товара</span>
                                        <span className="product-page__char-value">{id}</span>
                                    </div>
                                    {
                                        options && options.map((opt, i) => {
                                            return (
                                                <div key={opt.id} className="product-page__char text">
                                                    <span className="product-page__char-name">{opt.title}</span>
                                                    <span className="product-page__char-value">{opt.value}</span>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="product-page__lang text">
                                        Языки интерфейса: <span>Русский</span>
                                    </div>
                                </div>
                            </section>
                            <div className="product-page__vars">
                                {
                                    parameters && parameters.map(({id, title, price, sale_price, has_sale, description, sale_percent}, i) => {
                                        return (
                                            <Parameter
                                                key={id}
                                                productId={productData.id}
                                                id={id}
                                                title={title}
                                                price={+price}
                                                salePrice={+sale_price}
                                                hasSale={has_sale}
                                                salePercent={sale_percent as string}
                                                description={description as string}
                                                buyPopupOpener={setIsBuyPopupOpened}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </RootPage>
            <BuyPopup isOpened={isBuyPopupOpened} closeHandler={setIsBuyPopupOpened}/>
        </>
    );
}
 
export default ProductPage;