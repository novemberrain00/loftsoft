import { FC, useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";

import RootPage from "../rootPage/rootPage";

import FilterArrowIcon from '../../assets/images/icons/filter-arrow.svg'; 

import Product from "../../components/product/product";
import CatalogSection from "../../components/catalogSection/catalogSection";
import DiscountInput from "../../components/discountInput/discountInput";
import Loader from "../../components/loader/loader";

import { convertToLatin, getData } from "../../services/services";
import { CategoryI, ProductI, SubcategoryI } from "../../interfaces";

import './catalogPage.scss';
import { CategoriesContext } from "../../context";

interface CatalogPagePropsI {
    
}
 
const CatalogPage: FC<CatalogPagePropsI> = () => {
    const {subcategory} = useParams();

    const [filters, setFilters] = useState({ // 0 - по возрастанию, 1 - по убыванию
        price: 0,
        rating: 0,
        sale: 0

    });
    const [categories, setCategories] = useState<CategoryI[]>([]);
    const [products, setProducts] = useState<ProductI[]>([]);
    const [path, setPath] = useState({
        categoryName: '',
        subcategoryName: ''
    });
    const [productsOffset, setProductsOffset] = useState<number>(0);
    const [areFiltersOpened, setAreFiltersOpened] = useState<boolean>(false);
    const catalogBodyRef = useRef<HTMLDivElement>(null);
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

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

    const categoriesArr = useContext(CategoriesContext);

    useEffect(() => {
        setCategories([...categoriesArr])
    }, [categoriesArr])



    useEffect(() => {
        const fetchData = async () => { 
            if(subcategory) {
                console.log('lol')
                await getData(`/subcategory/${subcategory}/products?${filters.price < 2 ? `price_sort=${filters.price}` : ''}&${filters.rating < 2 ? `rating_sort=${filters.rating}&` : ''}&sale_sort=${filters.sale}&limit=20&offset=0`)
                .then((data: ProductI[]) => {
                    setProducts(data);
                    if(!categories.length) return;
                    setPathString(categories);
                });

                return
            } else {
                console.log('lol2')
                await getData(`/products?${filters.price < 2 ? `price_sort=${filters.price}` : ''}&${filters.rating < 2 ? `rating_sort=${filters.rating}&` : ''}&sale_sort=${filters.sale}&limit=20&offset=0`)
                .then((data: ProductI[]) => setProducts(data))
            }

            
        }

        fetchData(); 
    }, [subcategory, filters]);

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

        // getData('/categories?empty_filter=true')
        //     .then(data => {
        //         setCategories(data)
        //         setPathString(data);
        //     });
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    document.title = path.subcategoryName ? `Товары - ${path.subcategoryName}` : 'Все товары'

    return (
        <RootPage>
                <div className="container content__container catalog__container">
                    <div className="catalog__banner block">
                        <div className="catalog__banner-top">
                            <h2 className="title catalog__banner-title">Ваша персональная скидка</h2>
                            <div className="discount banner__discount">
                                <DiscountInput additionalClass="catalog__discount-input"/>
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
                            <div 
                                onClick={() => setAreFiltersOpened(!areFiltersOpened)} 
                                className={`catalog__filters-opener ${areFiltersOpened ? 'catalog__filters-opener_active' : ''} block mobile-flex`}
                            >
                                Показать фильтры
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M7 10L12 15L17 10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                            </div>
                            <div className="catalog__filters">
                                <h2 className="title desktop-block catalog__query-title">Фильтры</h2>
                                <ul className={`list catalog__filters-items ${areFiltersOpened ? "" : "catalog__filters-items_closed"}`}>
                                    <li className="catalog__filter">
                                        По цене:
                                        <span 
                                            onClick={() => setFilters({
                                                ...filters,
                                                price: filters.price > 0 ? 0 : 1,
                                                rating: 2
                                            })}
                                            className={
                                                `block catalog__filter-value 
                                                ${filters.price === 1 ? 'catalog__filter-value_active' : ''} 
                                                ${filters.price === 2 ? 'catalog__filter-value_disabled' : ''}`
                                            }
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
                                                rating: filters.rating ? 0 : 1,
                                                price: 2
                                            })}
                                            className={
                                                `
                                                    block catalog__filter-value 
                                                    ${filters.rating === 1 ? 'catalog__filter-value_active' : ''} 
                                                    ${filters.rating === 2 ? 'catalog__filter-value_disabled' : ''}
                                                `
                                            }
                                        >
                                            {filters.rating ? `По\u00A0возрастанию` : 'По убыванию'}
                                            <img src={FilterArrowIcon} alt="По убыванию"/>
                                        </span>
                                    </li>
                                    <li className="catalog__filter">
                                        <button 
                                            onClick={() => setFilters({
                                                ...filters,
                                                sale: filters.sale ? 0 : 1
                                            })}
                                            className={
                                                `
                                                    block catalog__filter-value 
                                                    ${filters.sale === 1 ? 'catalog__filter-value_active' : ''} 
                                                    ${filters.sale === 2 ? 'catalog__filter-value_disabled' : ''}
                                                `
                                            }
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
                                    categories.length ? categories.map(({id, title, photo, subcategories, colors}, i) => {
                                        return <CatalogSection 
                                            key={id} 
                                            name={title}
                                            category={convertToLatin(title)}
                                            icon={baseURL + '/uploads/'+ photo} 
                                            subcategories={subcategories}
                                            colors={colors}
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
                                        imgPath={baseURL + '/uploads/' + product.product_photos[0]?.photo}
                                        descr={product.description}
                                        priceOld={product.card_price}
                                        priceNew={product.card_sale_price}
                                        discount={product.sale_percent}
                                        url={`/catalog/${product.subcategory_id}/${product.id}`}
                                    />
                                }) : <Loader/>
                            }
                        </div>
                    </div>
                </div>
        </RootPage>
    );
}
 
export default CatalogPage;