import { FC, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useClipboard } from "use-clipboard-copy";

import RootPage from "../rootPage/rootPage";
import CopyIcon from '../../assets/images/icons/copy.svg';

import FilterArrowIcon from '../../assets/images/icons/filter-arrow.svg'; 
import DropdownIcon from "../../assets/images/icons/dropdown-arrow.svg"

import Product from "../../components/product/product";
import CatalogSection from "../../components/catalogSection/catalogSection";

import { convertToLatin, getData } from "../../services/services";
import { CategoryI, ProductI, SubcategoryI } from "../../interfaces";

import Loader from "../../components/loader/loader";
import './catalogPage.scss';

interface CatalogPagePropsI {
    
}
 
const CatalogPage: FC<CatalogPagePropsI> = () => {
    const {subcategory} = useParams();

    const [filters, setFilters] = useState({ //false - по возрастанию, true - по убыванию
        price: false,
        rating: true,
        sale: false

    });
    const [categories, setCategories] = useState<CategoryI[]>([]);
    const [products, setProducts] = useState<ProductI[]>([]);
    const [path, setPath] = useState({
        categoryName: '',
        subcategoryName: ''
    });
    const [productsOffset, setProductsOffset] = useState<number>(0);
    const catalogBodyRef = useRef<HTMLDivElement>(null);
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const clipboard = useClipboard();

    const setPathString = (data: CategoryI[]) => {
        const curCategory = data.filter((cat: CategoryI) => {
            return cat.subcategories.includes(cat.subcategories.filter(subcat => subcat.id === +(subcategory || 0))[0])
        })[0];
    
        const categoryName = curCategory?.title;
        const subcategoryName = curCategory?.subcategories.filter((subcat: SubcategoryI) => subcat.id === +(subcategory || 0))[0].title;

        setPath({
            categoryName,
            subcategoryName
        });
    }

    useEffect(() => {
        if(subcategory === undefined) return;
 
        getData(`/subcategory/${subcategory}/products?price_sort=${filters.price}&rating_sort=${filters.rating}&sale_sort=${filters.sale}&limit=20&offset=${productsOffset}`)
        .then((data: ProductI[]) => {
            setProducts([...products, ...data]);
            if(!categories.length) return;
            setPathString(categories);
        });
    }, [subcategory, filters, productsOffset]);

    useEffect(() => {
        getData('/categories?empty_filter=true')
        .then(data => {
            setCategories(data)
            setPathString(data);
        });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
          if (catalogBodyRef.current) {
            const { scrollHeight, clientHeight } = catalogBodyRef.current;
            const scrollPosition = (document.querySelector('html')?.scrollTop || 0) + clientHeight;
            
            if (scrollPosition > scrollHeight) {
              setProductsOffset(productsOffset+20);
            }
          }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    return (
        <RootPage>
            <main className="content catalog">
                <div className="container content__container catalog__container">
                    <div className="catalog__banner block">
                        <div className="catalog__banner-top">
                            <h2 className="title catalog__banner-title">Ваша персональная скидка</h2>
                            <div className="discount banner__discount">
                                <label onClick={clipboard.copy} htmlFor="discount-input" className="discount__input-label">
                                    <input ref={clipboard.target} type="text" value="OPENSOFT23" className="discount__input catalog__discount-input" id="discount-input" readOnly/>
                                    <img src={CopyIcon} alt="скопировать" className="discount__icon"/>
                                </label>
                                <span className="discount-value">-5%</span>
                            </div>
                        </div>
                        <div className="catalog__banner-footer">
                            <div className="catalog__query">
                                <h2 className="catalog__query-title title">Найдено {products.length} товаров по вашему запросу</h2>
                               {
                                    subcategory ? <p className="catalog__banner-category text">
                                        {path.categoryName} / {path.subcategoryName}
                                    </p> : <p className="catalog__banner-category text">
                                        Выберите категорию
                                    </p> 
                                }
                            </div>
                            <div className="catalog__filters-opener block mobile-flex">
                                Показать фильтры
                                <img src={DropdownIcon} alt="Показать фильтры"/>
                            </div>
                            <div className="catalog__filters">
                                <h2 className="title desktop-block catalog__query-title">Фильтры</h2>
                                <ul className="list catalog__filters-items">
                                    <li className="catalog__filter">
                                        По цене:
                                        <span 
                                            onClick={() => setFilters({
                                                ...filters,
                                                price: !filters.price
                                            })}
                                            className={`block catalog__filter-value ${filters.price && 'catalog__filter-value_active'}`}
                                        >
                                            {filters.price ? `По\u00A0возрастанию` : 'По убыванию'}
                                            <img src={FilterArrowIcon} alt="По убыванию"/>
                                        </span>
                                    </li>
                                    <li className="catalog__filter">
                                        По рейтингу:
                                        <span 
                                            onClick={() => setFilters({
                                                ...filters,
                                                rating: !filters.rating
                                            })}
                                            className={`block catalog__filter-value ${!filters.rating && 'catalog__filter-value_active'}`}
                                        >
                                            По убыванию
                                            <img src={FilterArrowIcon} alt="По убыванию"/>
                                        </span>
                                    </li>
                                    <li className="catalog__filter">
                                        <button 
                                            onClick={() => setFilters({
                                                ...filters,
                                                sale: !filters.sale
                                            })}
                                            className={`block catalog__filter-value ${filters.sale && 'catalog__filter-value_active'}`}
                                        >
                                            Товары по скидке
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="catalog__main">
                        <aside className="catalog__sidebar">
                            <h3 className="catalog__sidebar-header block">Каталог</h3>
                            <div className="catalog__sidebar-items">
                                {
                                    categories.length ? categories.map(({id, title, photo, subcategories}, i) => {
                                        return <CatalogSection 
                                            key={id} 
                                            name={title}
                                            category={convertToLatin(title)}
                                            icon={baseURL + '/uploads/'+ photo} 
                                            subcategories={subcategories}
                                            background='blue'
                                        />
                                    }) : <Loader additionalClass="catalog__sidebar-loader"/>
                                }
                            </div>
                        </aside>
                        <div ref={catalogBodyRef} className="catalog__products">
                            {
                                products.length ? products.map((product, i) => {
                                    return <Product
                                        key={product.id}
                                        id={product.id} 
                                        name={product.title}
                                        imgPath={baseURL + '/uploads/' + product.product_photos[0].photo}
                                        descr={product.description}
                                        priceOld={product.card_price}
                                        priceNew={product.card_sale_price}
                                        discount={product.sale_percent}
                                        url={product.id+''}
                                    />
                                }) : <Loader/>
                            }
                        </div>
                    </div>
                </div>
            </main>
        </RootPage>
    );
}
 
export default CatalogPage;