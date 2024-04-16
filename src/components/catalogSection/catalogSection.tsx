import { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SubcategoryI } from "../../interfaces";

import './catalogSection.scss';

interface CatalogSectionProps {
    name: string
    icon: string
    colors: string[]
    category: string
    subcategories: SubcategoryI[]
}
 
const CatalogSection: FC<CatalogSectionProps> = ({name, icon,subcategories,  colors}) => {
    const [isProductsListOpened, setIsProductsListOpened] = useState(false);

    const {subcategory} = useParams();

    return ( 
        <div className="catalog__section">
            <div 
                style={{background: colors.length ? `linear-gradient(93deg, ${colors[0]} 0%, ${colors[1]} 100%)` : ''}}
                className="block catalog__section-header"
                onClick={() => setIsProductsListOpened(!isProductsListOpened)}
            >
                <svg style={{transform: isProductsListOpened? 'rotate(180deg)' : 'initial'}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <mask id="mask0_689_1123" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                        <rect x="20" width="20" height="20" transform="rotate(90 20 0)" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_689_1123)">
                    <path d="M1.66668 6.68742L3.14584 5.20825L10 12.0624L16.8542 5.20825L18.3333 6.68742L10 15.0208L1.66668 6.68742Z" fill={isProductsListOpened ? '#fff' : '#000'}/>
                    </g>
                </svg>
                <h3 className="text catalog__section-name" style={{color: '#000'}}>{name}</h3>
                <img src={icon} alt="Разное" className="catalog__section-icon"/>
            </div>
            <div className={`block catalog__section-products ${isProductsListOpened ? 'catalog__section-products_opened' : ''}`}>
                <ul className='list catalog__section-list'>
                    {
                        subcategories.map(({title, id}, i) => {
                            
                            return (
                                <li key={id} className="catalog__section-product">
                                    <Link to={`/catalog/${id}`}>
                                        <span 
                                            className={`catalog__section-link ${id === +(subcategory || 0) ? 'catalog__section-link_active' : ''} link text text_small`}
                                        >
                                            {title}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </div>
     );
}
 
export default CatalogSection;