import { FC, useEffect, useState } from "react";
import { ProductI } from "../../interfaces";

import ArrowRightIcon from '../../assets/images/icons/arrow_right_bold.svg';
import { getData } from "../../services/services";
import { Link } from "react-router-dom";
import Loader from "../loader/loader";

interface SearchListPropsI {
    term: string
}
 
const SearchList: FC<SearchListPropsI> = ({term}) => {
    const [items, setItems] = useState<ProductI[]>([]);
    const [searchStatus, setSearchStatus] = useState<'processing' | 'done'>('processing');
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    useEffect(() => {
        if(term.length === 0) return;

        setSearchStatus('processing')

        getData(`/products?query=${term}`)
        .then((data: ProductI[]) => {
            setItems(data);
            setSearchStatus('done');
        });
    }, [term]);

    const declineWordByNumber = (number: number): string => {
        const cases = [2, 0, 1, 1, 1, 2];
        const words = ['совпадение', 'совпадения', 'совпадений'];
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    return term.length > 0 ? (
        <div className="search__results">
            {
                items.length && searchStatus === 'done' ? `Найдено ${items.length} ${declineWordByNumber(items.length)}` : null
            }

            {
                !items.length && searchStatus === 'done' ? `Совпадений не найдено` : null
            }
            <ul className="search__results-list list">
                {
                    items.length && searchStatus === 'done' ? items.map(({id, title, product_photos, subcategory_id}) => {
                        return (    
                            <Link to={`/catalog/${subcategory_id}/${id}`}>
                                <li key={id} className="search__results-item">
                                    <img src={baseURL + '/uploads/' + product_photos[0].photo} alt={title} className="search__results-img"/>
                                    <div className="search__results-info">
                                        <h5 className="search__results-title title">{title}</h5>
                                        Категория: Операционные системы
                                    </div>
                                    <img src={ArrowRightIcon} alt="перейти" className="search__results-icon"/>
                                </li>  
                            </Link>
                        );
                    }) : null
                }   
                {
                    searchStatus === 'processing' ? <Loader additionalClass="search__results-loader"/> : null
                }
            </ul>
        </div>
    ) : null;
}
 
export default SearchList;