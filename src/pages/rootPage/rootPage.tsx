import { FC, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import { LinkI, SnackI, UserI } from '../../interfaces'

import LogoImg from '../../assets/images/logo/logo.svg'
import LogoMobileImg from '../../assets/images/logo/logo_mobile.svg'
import CartIcon from '../../assets/images/icons/shopping_cart.svg'
import UpdateIcon from '../../assets/images/icons/update.svg'
import SearchIcon from '../../assets/images/icons/search.svg'
import BlueSquareIcon from '../../assets/images/icons/blue-square.svg'
import AccountIcon from '../../assets/images/icons/account.svg'
import BackIcon from '../../assets/images/icons/arrow-left_black.svg'
import RequestIcon from '../../assets/images/icons/request.svg'
import MobileLogo from '../../assets/images/logo/logo_mobile.svg'
import WhatsappIcon from '../../assets/images/icons/whatsapp.svg'
import TelegamIcon from '../../assets/images/icons/tg.svg'

import DiscountImg from '../../assets/images/img/discount.svg'

import Dropdown from '../../components/dropdown/dropdown'
import History from '../../components/history/history'

import { useSelector, useDispatch } from 'react-redux'

import SnackbarContainer from '../../components/snackbar/snackbar'
import Snack from '../../components/snack/snack'
import SearchList from '../../components/searchList/searchList'
import MobileMenu from '../../components/mobileMenu/mobileMenu'

import Profile from '../../components/profile/profile'
import Chat from '../../components/chat/chat'
import HeaderNavItem from '../../components/headerNavItem/headerNavItem'

import { RootState } from '../../store'
import { getData } from '../../services/services'
import { setUserInfo } from '../../redux/userSlice'
import useDebounce from '../../hooks/useDebounce'

import ReplenishPopup from '../../components/replenishPopup/replenishPopup'
import Request from '../../components/request/request'
import './rootPage.scss'
import DiscountInput from '../../components/discountInput/discountInput'
import { CategoriesContext } from '../../context'

interface RootPagePropsI {
	isFooterHidden?: boolean
	children: React.ReactNode
}

interface ActiveProductDataI {
	name: string
	items: LinkI[]
	category: number
}

const RootPage: FC<RootPagePropsI> = ({ isFooterHidden, children }) => {
	const dispatch = useDispatch()

	const [activeProductData, setActiveProductData] = useState<ActiveProductDataI>({
		name: '',
		items: [],
		category: 0,
	})

	const [seachTerm, setSearchTerm] = useState<string>('')
	const [isHistoryShowed, setIsHistoryShowed] = useState<boolean>(false)
	const [isProfileOpened, setIsProfileOpened] = useState<boolean>(false)
	const [isReplenishOpened, setIsReplenishOpened] = useState<boolean>(false)
	const [isChatOpened, setIsChatOpened] = useState<boolean>(false)
	const [isDropdownOpened, setIsDropdownOpened] = useState<boolean>(false)
	const [isSubcatsOpened, setIsSubcatsOpened] = useState<boolean>(false)
	const [isRequestOpened, setIsRequestOpened] = useState<boolean>(false)

	const snacks = useSelector((state: RootState) => state.snackbar.snacksArr)
	const userData = useSelector((state: RootState) => state.user.userInfo)
	const baseURL = process.env.REACT_APP_DEV_SERVER_URL

	const categories = useContext(CategoriesContext)

	const { id, username, photo, balance, shop_cart } = userData

	const debouncedTerm = useDebounce(seachTerm, 300)

	useEffect(() => {
		if (!categories.length) return

		setActiveProductData({
			name: categories[0]?.title,
			items: categories[0]?.subcategories.map((subcat) => {
				return {
					text: subcat.title,
					path: '/catalog/' + subcat.id,
				}
			}),
			category: categories[0]?.id,
		})
	}, [categories])

	useEffect(() => {
		window.scrollTo(0, 0)

		const getUserData = async () => {
			await getData('/user/me', true).then((data: UserI) => {
				dispatch(
					setUserInfo({
						...data,
						photo: baseURL + '/uploads/' + data.photo,
					}),
				)

				document.cookie = `is_admin=${data.is_admin}`
			})
		}

		if (window.localStorage.getItem('access_token') && id === null) getUserData()
	}, [])

	return (
		<>
			<Dropdown
				text='Каталог товаров'
				classList='header__menu-item header__menu-link link'
				isListOpened={isDropdownOpened}
				setIsListOpened={setIsDropdownOpened}
				isMobile={true}>
				<div className='block header__dropdown header__dropdown_mobile'>
					{!isSubcatsOpened ? (
						<div className='header__dropdown-categories'>
							<h3 className='header__dropdown-title'>
								Категории
								<div onClick={() => setIsRequestOpened(true)} className='header__info-request'>
									<img src={RequestIcon} alt='Запрос товара' />
									<span>Запрос товара</span>
								</div>
							</h3>
							{categories?.length &&
								categories.map(({ id, title, subcategories, photo }, i) => {
									return (
										<div
											key={id}
											className='header__dropdown-category'
											onClick={() => {
												setActiveProductData({
													name: title,
													items: subcategories.map((subcat) => {
														return {
															text: subcat.title,
															path: '/catalog/' + subcat.id,
														}
													}),
													category: id,
												})
												setIsSubcatsOpened(true)
											}}>
											{title}
											<img
												src={baseURL + '/uploads/' + photo}
												alt={title}
												className='header__dropdown-icon'
											/>
										</div>
									)
								})}
							<div style={{ marginTop: '65%' }} className='header__discount'>
								<div className='header__discount-content'>
									<h5 className='text header__discount-title'>Ваша персональная скидка</h5>
									<div className='discount header__dropdown-discount'>
										<DiscountInput additionalClass='header__discount-input' />
										<span className='discount-value'>-5%</span>
									</div>
								</div>
								<img
									src={BlueSquareIcon}
									alt='ваша персональная скидка'
									className='header__discount-icon'
								/>
							</div>
						</div>
					) : (
						<div className='header__dropdown-products'>
							<h2 className='header__dropdown-title title'>
								<img src={BackIcon} onClick={() => setIsSubcatsOpened(false)} alt='Назад' />
								{activeProductData.name}
							</h2>
							<ul className='list header__dropdown-list'>
								{activeProductData.items.map(({ text, path }, i) => {
									return (
										<li key={text} className='header__dropdown-item'>
											<Link to={path}>
												<a href={path} className='header__dropdown-link text text_small link'>
													{text}
												</a>
											</Link>
										</li>
									)
								})}
							</ul>
						</div>
					)}
				</div>
			</Dropdown>
			<header className='header header_mobile'>
				<div className='container header__container content__container'>
					<ul className='list header__top'>
						<Link to='/'>
							<img src={MobileLogo} alt='LoftSoft' className='mobile-logo' />
						</Link>
						<div className='header__media'>
							<a href='#' className='header__media-link'>
								<img src={WhatsappIcon} alt='наш телеграм' />
							</a>
							<a href='#' className='header__media-link'>
								<img src={TelegamIcon} alt='наш whatsapp' />
							</a>
						</div>
						<HeaderNavItem text='Отзывы' path='/reviews' />
						<HeaderNavItem text='Правила' path='/terms/pravila-magazina' />
					</ul>
					<div className='search header__search'>
						<img src={SearchIcon} alt='поиск' className='search__icon header__search-icon' />
						<input
							onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
							onBlur={() => setSearchTerm('')}
							placeholder='Поиск'
							type='text'
							className='search__input header__search-input'
						/>
						<SearchList term={debouncedTerm} />
					</div>
				</div>
			</header>
			<header className='header'>
				<div className='container header__container'>
					<Link to='/'>
						<div className='header__logo'>
							<img src={LogoImg} alt='loftsoft' className='desktop-block header__logo-img' />
							<img src={LogoMobileImg} alt='loftsoft' className='mobile-block header__logo-img' />
						</div>
					</Link>
					<div className='header__media'>
						<a href='#' className='header__media-link'>
							<img src={WhatsappIcon} alt='наш телеграм' />
						</a>
						<a href='#' className='header__media-link'>
							<img src={TelegamIcon} alt='наш whatsapp' />
						</a>
					</div>
					<div className='search header__search header__search_desktop'>
						<img src={SearchIcon} alt='поиск' className='search__icon header__search-icon' />
						<input
							onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
							onBlur={() => setSearchTerm('')}
							placeholder='Поиск'
							type='text'
							className='search__input header__search-input'
						/>
						<SearchList term={debouncedTerm} />
					</div>
					<div className='header__info'>
						<span
							onClick={() => setIsRequestOpened(true)}
							className='header__info-item header__info-request'>
							Запрос товара
							<img src={RequestIcon} alt='Запрос товара' />
						</span>
						<Link to='/profile/cart'>
							<a href='/' className='header__info-item' id='header-cart'>
								{!shop_cart?.length || (
									<span id='header-cart-quantity'>
										{shop_cart.reduce((acc, obj) => acc + obj.quantity, 0)}
									</span>
								)}
								<img src={CartIcon} alt='корзина' className='header__info-icon' />
							</a>
						</Link>
						<span
							onClick={() => setIsHistoryShowed(true)}
							className='header__info-item'
							id='header-update'>
							<img src={UpdateIcon} alt='история' className='header__info-icon' />
						</span>
						{username && (
							<div
								onClick={(e) => {
									if (!isProfileOpened) {
										setIsProfileOpened(true)
									} else {
										const target = e.target as HTMLElement
										const profileElement = document.querySelector('.profile') as Node
										const editorElement = document.querySelector('.editor') as Node

										if (!profileElement.contains(target) && !editorElement?.contains(target)) {
											;(profileElement as HTMLElement)?.classList.add('profile_disappeared')
											setTimeout(() => setIsProfileOpened(false), 200)
										}
									}
								}}
								className='header__profile'>
								{isProfileOpened && (
									<Profile
										isOpened={isProfileOpened}
										historyOpener={setIsHistoryShowed}
										data={userData}
										replenishOpener={setIsReplenishOpened}
										closeHandler={setIsProfileOpened}
									/>
								)}
								<img src={photo} alt={username} className='header__profile-img' />
								<span className='header__profile-name'>{username}</span>
								<button className='btn header__profile-price'>{balance}&nbsp;₽</button>
							</div>
						)}

						{!username && (
							<Link to='/auth'>
								<div className='header__auth text'>
									<img className='header__auth-icon' src={AccountIcon} alt='Авторизация' />
									Авторизация
								</div>
							</Link>
						)}
					</div>
				</div>
				<div className='container header__container header__container_mobile'>
					<div className='search header__search'>
						<img src={SearchIcon} alt='поиск' className='search__icon header__search-icon' />
						<input
							onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
							onBlur={() => setSearchTerm('')}
							placeholder='Поиск'
							type='text'
							className='search__input header__search-input'
						/>
						<SearchList term={debouncedTerm} />
					</div>
				</div>
				<div className='container header__container'>
					<nav className='header__menu'>
						<ul className='list header__menu-list'>
							<Dropdown
								text='Каталог товаров'
								classList='header__menu-item header__menu-link link'
								isListOpened={isDropdownOpened}
								setIsListOpened={setIsDropdownOpened}>
								<div className='block header__dropdown'>
									<div className='header__dropdown-categories'>
										{categories?.length &&
											categories.map(({ id, title, subcategories, photo }, i) => {
												return (
													<div
														key={id}
														className='header__dropdown-category'
														onClick={() => {
															setActiveProductData({
																name: title,
																items: subcategories.map((subcat) => {
																	return {
																		text: subcat.title,
																		path: '/catalog/' + subcat.id,
																	}
																}),
																category: id,
															})
														}}>
														{title}
														<img
															src={baseURL + '/uploads/' + photo}
															alt={title}
															className='header__dropdown-icon'
														/>
													</div>
												)
											})}
									</div>

									<div className='header__dropdown-products'>
										<h2 className='header__dropdown-title title'>{activeProductData.name}</h2>
										<ul className='list header__dropdown-list'>
											{activeProductData.items.map(({ text, path }, i) => {
												return (
													<li key={text} className='header__dropdown-item'>
														<Link to={path}>
															<a
																href={path}
																className='header__dropdown-link text text_small link'>
																{text}
															</a>
														</Link>
													</li>
												)
											})}
										</ul>
										<div className='header__discount'>
											<div className='header__discount-content'>
												<h5 className='text header__discount-title'>Ваша персональная скидка</h5>
												<div className='discount header__dropdown-discount'>
													<DiscountInput additionalClass='header__discount-input' />
													<span className='discount-value'>-5%</span>
												</div>
											</div>
											<img
												src={BlueSquareIcon}
												alt='ваша персональная скидка'
												className='header__discount-icon'
											/>
										</div>
									</div>
								</div>
							</Dropdown>
							<HeaderNavItem text='Отзывы' path='/reviews' />
							<HeaderNavItem text='Правила' path='/terms' />
						</ul>
					</nav>
				</div>
			</header>
			<main className='content'>{children}</main>
			{userData.is_admin ? null : <Chat isChatOpened={isChatOpened} setIsChatOpened={setIsChatOpened} />}

			{isFooterHidden ? null : (
				<footer className='footer'>
					<div className='container footer__container'>
						<div className='footer__left'>
							<div className='footer__logo'>
								<img src={LogoImg} alt='loftsoft' className='footer__logo-img' />
							</div>
							<div className='footer__descr'>
								Магазин лицензий для цифровых продуктов <br />
								<Link to='/' className='link link_blue'>
									www.loftsoft.com
								</Link>
							</div>
							<img
								src={DiscountImg}
								alt='Оставьте отзыв, и получите скидку!'
								className='mobile-block footer__discount'
							/>
						</div>
						<div className='footer__right'>
							<nav className='footer__menu'>
								<ul className='footer__menu-list list'>
									<li className='footer__menu-item'>
										<Link to='/'  className='footer__menu-link link'>
											Главная страница
										</Link>
									</li>
									<li className='footer__menu-item'>
										<Link to='/' className='footer__menu-link link'>
											Стать поставщиком
										</Link>
									</li>
									<li className='footer__menu-item'>
										<Link to='/' className='footer__menu-link link'>
											Реферальная программа
										</Link>
									</li>
									<li className='footer__menu-item'>
										<Link to='/reviews' className='footer__menu-link link'>
											Оставить отзыв
										</Link>
									</li>
								</ul>
							</nav>
							<nav className='footer__menu'>
								<ul className='footer__menu-list list'>
									<li className='footer__menu-item'>
										<Link to='/terms/korrektirovki-i-pravila'>
											<span className='footer__menu-link link'>
												Как купить
											</span>
										</Link>
									</li>
									<li className='footer__menu-item'>
										<Link to='/terms/casto-zadavaemye-voprosy'>
											<span  className='footer__menu-link link'>
												FAQ
											</span>
										</Link>
									</li>
									<li className='footer__menu-item'>
										<Link to='/terms/pravila-vozvrata-7'>
											<span className='footer__menu-link link'>
												Правила возврата
											</span>
										</Link>
									</li>
									<li className='footer__menu-item'>
										<Link to='/terms/pravila-magazina-7'>
											<span className='footer__menu-link link'>
												Правила магазина
											</span>
										</Link>
									</li>
								</ul>
							</nav>
							<img
								src={DiscountImg}
								alt='Оставьте отзыв, и получите скидку!'
								className='desktop-block footer__discount'
							/>
						</div>
					</div>
					<SnackbarContainer>
						{snacks.map(({ text }: SnackI, i: number) => (
							<Snack text={text} key={i + ''} />
						))}
					</SnackbarContainer>
					<ReplenishPopup isOpened={isReplenishOpened} closeHandler={setIsReplenishOpened} />
					{window.innerWidth <= 756 && (
						<MobileMenu
							historyOpener={setIsHistoryShowed}
							profileOpener={setIsProfileOpened}
							isDropdownOpened={isDropdownOpened}
							chatOpener={setIsChatOpened}
							menuOpener={setIsDropdownOpened}
							replenishOpener={setIsReplenishOpened}
						/>
					)}

					<History
						replenishesOpener={setIsReplenishOpened}
						isOpened={isHistoryShowed}
						closeHandler={setIsHistoryShowed}
					/>
					<Request isOpened={isRequestOpened} closeHandler={setIsRequestOpened} />
				</footer>
			)}
		</>
	)
}

export default RootPage
