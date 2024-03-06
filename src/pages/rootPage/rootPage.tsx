import {FC, useState, useEffect} from 'react';

import { CategoryI, LinkI, SnackI, SubcategoryI } from '../../interfaces';
import { Link } from 'react-router-dom';

import Avatar from '../../assets/images/img/ava.png';

import LogoImg from '../../assets/images/logo/logo.svg';
import LogoMobileImg from '../../assets/images/logo/logo_mobile.svg';

import TgImg from '../../assets/images/icons/tg.svg';
import WhatsappImg from '../../assets/images/icons/whatsapp.svg';
import CartIcon from '../../assets/images/icons/shopping_cart.svg';
import UpdateIcon from '../../assets/images/icons/update.svg';
import SearchIcon from '../../assets/images/icons/search.svg';
import CopyIcon from '../../assets/images/icons/copy.svg';
import BlueSquareIcon from '../../assets/images/icons/blue-square.svg';
import AccountIcon from '../../assets/images/icons/account.svg';

import Business from '../../assets/images/img/catalog/bussines.png';
import Graphics from '../../assets/images/img/catalog/graphics.png';
import MSoffice from '../../assets/images/img/catalog/msoffice.png';
import Shield from '../../assets/images/img/catalog/shield.png';
import Windows from '../../assets/images/img/catalog/windows.png';
import Box from '../../assets/images/img/catalog/box.png';

import DiscountImg from '../../assets/images/img/discount.png';

import Dropdown from '../../components/dropdown/dropdown';
import Tabs from '../../components/tabs/tabs';
import History from '../../components/history/history';
import Overlay from '../../components/overlay/overlay';

import { useSelector, useDispatch } from "react-redux";

import SnackbarContainer from '../../components/snackbar/snackbar';
import Snack from '../../components/snack/snack';
import { RootState } from '../../store';

import Profile from '../../components/profile/profile';
import Chat from '../../components/chat/chat';
import { convertToLatin, getCookie, getData } from '../../services/services';
import { useClipboard } from 'use-clipboard-copy';
import { addSnack } from '../../redux/snackbarSlice';
import { setUserInfo } from '../../redux/userSlice';
import HeaderNavItem from '../../components/headerNavItem/headerNavItem';

import './rootPage.scss';

interface RootPagePropsI {
    children: React.ReactNode
}

interface ActiveProductDataI {
    name: string
    items: LinkI[]
    category: number
}

const RootPage: FC<RootPagePropsI> = ({children}) => {
    const [activeProductData, setActiveProductData] = useState<ActiveProductDataI>({
        name: 'Операционные системы',
        items: [
            {text: 'Windows 11', path:'#'}, 
            {text: 'Windows 8', path:'#'}, 
            {text: 'Windows 10', path:'#'}, 
            {text: 'Windows 7', path:'#'}, 
            {text: 'Windows Server 2022', path:'#'},
            {text: 'Windows Server 2019', path:'#'},
            {text: 'Windows Server 2016', path:'#'},
            {text: 'Windows Server 2012', path:'#'},
            {text: 'Windows Server RDS', path:'#'},
            {text: 'Windows SQL Server', path:'#'}
        ],
        category: 0
    });

    const [isHistoryShowed, setIsHistoryShowed] = useState(false);
    const [isProfileOpened, setIsProfileOpened] = useState(false); 
    const [categories, setCategories] = useState<CategoryI[]>([]);

    const dispatch = useDispatch();
    const snacks = useSelector((state: RootState) => state.snackbar.snacksArr);
    const userData = useSelector((state: RootState) => state.user.userInfo);
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    useEffect(() => {
        const getUserData = async () => {
            await getData('/user/me', true)
                .then(data => {
                    dispatch(setUserInfo({
                        ...data,
                        photo: baseURL+'/uploads/'+data.photo
                    }));

                    document.cookie = `is_admin=${data.is_admin}`;
                })

        }

        if(getCookie('access_token')) getUserData();

        getData('/categories?empty_filter=true', true)
        .then(data => {
            setCategories(data);
            setActiveProductData({
                name: data[0].title,
                items: data[0].subcategories.map((subcat: SubcategoryI) => {
                    return {
                        text: subcat.title,
                        path: '/catalog/'+ subcat.id
                    }
                }),
                category: data[0].id
            })
        });        
    }, []);

    const {
        username, 
        photo,
        balance,
        shop_cart
    } = userData;

    const clipboard = useClipboard({
        onSuccess: () => {
            dispatch(addSnack({text: 'Скопировано'}))
        }
    });

    return ( 
        <>
            <header className='header'>
                {
                    isHistoryShowed && <Overlay closeHandler={setIsHistoryShowed}>
                        <History closeHandler={setIsHistoryShowed}/>
                    </Overlay>
                }
                {
                    isProfileOpened && <Overlay closeHandler={setIsProfileOpened}>
                        <Profile data={userData} closeHandler={setIsProfileOpened}/>
                    </Overlay>
                }
                <div className="container header__container">
                    <Link to="/">
                        <div className="header__logo">
                            <img src={LogoImg} alt="loftsoft" className="desktop-block header__logo-img" />
                            <img src={LogoMobileImg} alt="loftsoft" className="mobile-block header__logo-img" />
                        </div>
                    </Link>
                    <div className="search header__search">
                        <img src={SearchIcon} alt="поиск" className="search__icon header__search-icon" />
                        <input placeholder="Поиск" type="text" className="search__input header__search-input" />
                    </div>
                    <div className="header__info">
                        <Link to="/profile/cart">
                            <a href="#" className="header__info-item" id="header-cart">
                                {!shop_cart?.length || <span id="header-cart-quantity">{shop_cart.reduce((acc, obj) => acc + obj.quantity, 0)}</span>}
                                <img src={CartIcon} alt="корзина" className="header__info-icon"/>
                            </a>
                        </Link>
                        <a href="#" onClick={() => setIsHistoryShowed(true)} className="header__info-item" id="header-update">
                            <img src={UpdateIcon} alt="обновить" className="header__info-icon"/>
                        </a>
                    
                        {username && <div onClick={() => setIsProfileOpened(true)} className="header__profile">
                            <img src={photo} alt={username} className="header__profile-img" />
                            <span className="header__profile-name">{username}</span>
                            <button className="btn header__profile-price">{balance} ₽</button>
                        </div>}

                        {!username && <Link to="/auth">
                            <div className="header__auth text">
                                <img className="header__auth-icon" src={AccountIcon} alt="Авторизация" />
                                Авторизация
                            </div>
                        </Link>}
                    </div>
                </div>
                <div className="container header__container">
                    <nav className="header__menu">
                        <ul className="list header__menu-list">
                            <Dropdown 
                                text="Каталог товаров"
                                classList="header__menu-item header__menu-link link"
                            >
                                <div className="block header__dropdown">
                                    <div className="header__dropdown-categories">
                                        {
                                            categories?.length && categories.map(({id, title, subcategories, photo}, i) => {
                                                return (
                                                    <div 
                                                        key={id}
                                                        className='header__dropdown-category'
                                                        onClick={() => {
                                                            setActiveProductData({
                                                                name: title,
                                                                items: subcategories.map(subcat => {
                                                                    return {
                                                                        text: subcat.title,
                                                                        path: '/catalog/'+ subcat.id
                                                                    }
                                                                }),
                                                                category: id
                                                            })
                                                        }}  
                                                    >
                                                        {title}
                                                        <img src={baseURL + '/uploads/' + photo} alt={title} className="header__dropdown-icon" />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    
                                    <div className="header__dropdown-products">
                                        <h2 className="header__dropdown-title title">{activeProductData.name}</h2>
                                        <ul className="list header__dropdown-list">
                                            {
                                                activeProductData.items.map(({text, path}, i) => {
                                                    return (
                                                        <li key={text} className="header__dropdown-item">
                                                            <Link to={path}>
                                                                <a href={path} className="header__dropdown-link text text_small link">{text}</a>
                                                            </Link>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                        <div className="header__discount">
                                            <div className="header__discount-content">
                                                <h5 className="text header__discount-title">Ваша персональная скидка</h5>
                                                <div className="discount header__dropdown-discount">
                                                    <label onClick={clipboard.copy} htmlFor="discount-input" className="discount__input-label">
                                                        <input type="text" ref={clipboard.target} value="OPENSOFT23" className="discount__input header__discount-input" id="discount-input" readOnly/>
                                                        <img src={CopyIcon} alt="скопировать" className="discount__icon"/>
                                                    </label>
                                                    <span className="discount-value">-5%</span>
                                                </div>
                                            </div>
                                            <img src={BlueSquareIcon} alt="ваша персональная скидка" className="header__discount-icon" />
                                        </div>
                                    </div>
                                </div>
                            </Dropdown>
                            <li className="header__menu-item">
                                <a href="#" className="link header__menu-link">Поставщикам</a>
                            </li>
                            <HeaderNavItem text='Отзывы' path='/reviews'/>
                            <HeaderNavItem text='Правила' path='/terms'/>
                        </ul>
                    </nav>
                </div>
            </header>
            {children}
            <Chat/>
            <footer className='footer'>
                <div className="container footer__container">
                    <div className="footer__left">
                        <div className="footer__logo">
                            <img src={LogoImg} alt="loftsoft" className="footer__logo-img" />
                        </div>
                        <div className="footer__descr">
                            Магазин лицензий для цифровых продуктов <br />
                            <Link to="/"><a href="/" className="link link_blue">www.loftsoft.com</a></Link>
                        </div>
                        <img src={DiscountImg} alt="Оставьте отзыв, и получите скидку!" className="mobile-block footer__discount" />
                    </div>
                    <div className="footer__right">
                        <nav className="footer__menu">
                            <ul className="footer__menu-list list">
                                <li className="footer__menu-item">
                                    <a href="#" className="footer__menu-link link">Стать поставщиком</a>
                                </li>
                                <li className="footer__menu-item">
                                    <a href="#" className="footer__menu-link link">Партнерская программа</a>
                                </li>
                                <li className="footer__menu-item">
                                    <a href="#" className="footer__menu-link link">API сервиса</a>
                                </li>
                                <li className="footer__menu-item">
                                    <a href="#" className="footer__menu-link link">Все категории</a>
                                </li>
                            </ul>
                        </nav>
                        <nav className="footer__menu">
                            <ul className="footer__menu-list list">
                                <li className="footer__menu-item">
                                    <a href="#" className="footer__menu-link link">Как купить?</a>
                                </li>
                                <li className="footer__menu-item">
                                    <a href="#" className="footer__menu-link link">FAQ</a>
                                </li>
                                <li className="footer__menu-item">
                                    <a href="#" className="footer__menu-link link">Поддержка магазина</a>
                                </li>
                                <li className="footer__menu-item">
                                    <Link to="/terms"><a href="#" className="footer__menu-link link">Правила магазина</a></Link>
                                </li>
                            </ul>
                        </nav>
                        <img src={DiscountImg} alt="Оставьте отзыв, и получите скидку!" className="desktop-block footer__discount" />
                    </div>
                </div>
                <SnackbarContainer>
                    {
                        snacks.map(({text}:SnackI, i:number) => <Snack text={text} key={i+''}/>)
                    }
                </SnackbarContainer>
            </footer>
        </>
    );
}
 
export default RootPage;