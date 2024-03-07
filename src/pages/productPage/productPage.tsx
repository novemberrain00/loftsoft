import { FC, useEffect, useState } from "react";
import FsLightbox from "fslightbox-react";

import RootPage from "../rootPage/rootPage";
import Path from "../../components/path/path";

import BlueStar from '../../assets/images/icons/star_blue.svg';

import { convertToLatin, getData, postData } from "../../services/services";

import { ProductI } from "../../interfaces";
import Parameter from "../../components/parameter/parameter";

import './productPage.scss';
import { useParams } from "react-router-dom";

interface ProductPagePropsI {
}
 
const ProductPage: FC<ProductPagePropsI> = () => {
    const [productData, setProductData] = useState<ProductI>({} as ProductI);
    const [toggler, setToggler] = useState<boolean>(false);
    const [subcategoryName, setSubcategoryName] = useState<string>('');

    const { product, subcategory } = useParams();

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    useEffect(() => {
        const getProductData = async () => {
            await getData(`/product/${product}`)
            .then(data => setProductData(data));

            await getData(`/subcategory/${subcategory}`)
            .then(data => {
                setSubcategoryName(data.title)
            })
        }

        getProductData();
    }, []);

    const {
        title,
        parameters,
        options,
        description,
        product_photos,
        sale_percent
    } = productData;

    return (
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
                            path: `/catalog/${convertToLatin(subcategory as string)}`
                        },
                        {
                            text: title,
                            path: ''
                        },
                    ]}/>
                </div>
                <div className="container product-page__container">
                    <div className="product-page__gallery">
                        <div onClick={() => setToggler(true)} className="product-page__gallery_animated product-page__gallery-active">
                            {product_photos && <img src={baseURL + '/uploads/' + product_photos.filter(photo => photo.main)[0]?.photo} alt={title} className="desktop-block product-page__gallery-item" />}
                        </div>
                        <div className="product-page__gallery-items">
                            <FsLightbox
                                toggler={toggler}
                                sources={product_photos && [...product_photos.map((photo, i) => {
                                    return <img 
                                        key={photo.photo}
                                        src={baseURL + '/uploads/' + photo.photo} 
                                        alt={title} className="product-page__gallery-item" 
                                    />
                                })]}
                            />
                            {product_photos && product_photos.filter(photo => !photo.main).map((photo, i) => {
                                return <img 
                                    key={photo.photo}
                                    src={baseURL + '/uploads/' + photo.photo} 
                                    alt={title} className="product-page__gallery-item" 
                                    onClick={() => setToggler(!toggler)}
                                />
                            })}
                        </div>
                    </div>
                    <div className="product-page__info">
                        <h1 className="product-page__title title">{title}</h1>
                        <div className="product-page__rate">
                            5.0
                            <div className="product-page__rate-stars">
                                <img src={BlueStar} alt="Windows 10 OEM" className="product-page__rate-star" />
                                <img src={BlueStar} alt="Windows 10 OEM" className="product-page__rate-star" />
                                <img src={BlueStar} alt="Windows 10 OEM" className="product-page__rate-star" />
                                <img src={BlueStar} alt="Windows 10 OEM" className="product-page__rate-star" />
                                <img src={BlueStar} alt="Windows 10 OEM" className="product-page__rate-star" />
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
                                {
                                    options && options.map((opt, i) => {
                                        return (
                                            <div key={i+""} className="product-page__char text">
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
                                parameters && parameters.map(({id, title, price, sale_price, has_sale, description}, i) => {
                                    return (
                                        <Parameter
                                            key={id}
                                            productId={productData.id}
                                            id={id}
                                            title={title}
                                            price={+price}
                                            salePrice={+sale_price}
                                            hasSale={has_sale}
                                            salePercent={sale_percent}
                                            description={description as string}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </main>
        </RootPage>
    );
}
 
export default ProductPage;