import { FC, useEffect, useState } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import SearchIcon from "../../../assets/images/icons/search.svg";
import RefreshIcon from "../../../assets/images/icons/refresh.svg";
import PlusIcon from "../../../assets/images/icons/plus.svg";
import OptionsIcon from "../../../assets/images/icons/options_bold.svg";
import TrashIcon from "../../../assets/images/icons/trash.svg";

import Popup from "../../../components/categoryPopup/categoryPopup";

import { PostPromocodeI } from "../../../interfaces";
import { deleteData, getData, postData } from "../../../services/services";

import "./promocodes.scss";

interface PromocodesPropsI {
    
}
 
const Promocodes: FC<PromocodesPropsI> = () => {
    const [isCreatePromoPopupOpened, setIsCreatePromoPopupOpened] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [promocodes, setPromocodes] = useState([]);
    const [action, setAction] = useState<'post' | 'edit'>('post');
    const [curPromo, setCurPromo] = useState<PostPromocodeI>({
        id: -1,
        name: '',
        activations_count: '',
        sale_percent: ''
    });

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const postPromo = async () => {
        const {name, activations_count, sale_percent} = curPromo;
        
        if(!name.length) {
            setAlertMessage('Введите промокод');
            return
        }

        if(+sale_percent <= 0) {
            setAlertMessage('Скидка должна быть больше 0');
            return
        }

        await postData('/promocodes/', {
            name,
            activations_count: +activations_count,
            sale_percent: +sale_percent
        }, true)
        .then(async () => {
            await getData('/promocodes', true)
            .then(data => setPromocodes(data));
            
            setIsCreatePromoPopupOpened(false);
            setCurPromo({
                id: -1,
                name: '',
                activations_count: '',
                sale_percent: ''
            });
        });
    }

    const editPromo = async (id: number) => {
        const {name, activations_count, sale_percent} = curPromo;

        if(!name.length) {
            setAlertMessage('Введите промокод');
            return
        }

        if(+sale_percent <= 0) {
            setAlertMessage('Скидка должна быть больше 0 процентов');
            return
        }

        await fetch(baseURL + `/promocode/${id}`, {
            method: 'PATCH',
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + window.localStorage.getItem('access_token') as string,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                activations_count: +activations_count,
                sale_percent: +sale_percent
            })
        })
        .then((data) => data.json())
        .then((data: PostPromocodeI) => {
            const promocodesArrRef: PostPromocodeI[] = promocodes;
            promocodesArrRef[promocodesArrRef.indexOf(promocodesArrRef.filter(promo => promo.id === id)[0]) ] = data

            setPromocodes(promocodesArrRef as never[])

            setIsCreatePromoPopupOpened(false);
        })
    }

    const deletePromo = async (id: number, i: number) => {
        await deleteData(`/promocode/${id}`)
        .then(() => {
            const promocodesArrRef = promocodes;
            promocodesArrRef.splice(i, 1);
            setPromocodes([...promocodesArrRef])
        });
    }

    useEffect(() => {
        getData('/promocodes', true)
        .then(data => setPromocodes(data))
    }, [])

    return (
        <>
            <AdminHeader title="Промокоды">
                <button className="btn admin__btn" onClick={() => window.location.reload()}>
                    <img src={RefreshIcon} alt="Обновить" />
                    Обновить
                </button>
                <button onClick={() => {
                    setAction('post')
                    setIsCreatePromoPopupOpened(true);
                }} className="btn admin__btn">
                    <img src={PlusIcon} alt="Создать промокод" className="admin__btn-icon" />
                    Создать промокод
                </button>
            </AdminHeader>
            <Popup isPopupOpened={isCreatePromoPopupOpened} setIsPopupOpened={setIsCreatePromoPopupOpened}>
                <h3 className="title popup__title">Создание промокода</h3>
                <div className="popup__body">
                    <label htmlFor="editor__input-name-40303" className="input popup__input">
                        <span className="input__label">Промокод</span>
                        <input 
                            onInput={(e) => setCurPromo({
                                ...curPromo,
                                name: (e.target as HTMLInputElement).value
                            })}
                            value={curPromo.name}
                            type="text" 
                            id="editor__input-name-40303" 
                            className="input__text" 
                            placeholder="Промокод"
                        />
                    </label>
                   {
                    +curPromo.activations_count > -1 || isNaN(+curPromo.activations_count)? <label htmlFor="editor__input-name-50391" className="input popup__input">
                        <span className="input__label">Количество активаций</span>
                        <input 
                            onInput={(e) => setCurPromo({
                                ...curPromo,
                                activations_count: (e.target as HTMLInputElement).value
                            })}
                            value={curPromo.activations_count || ''}
                            type="text" 
                            id="editor__input-name-48581" 
                            className="input__text" 
                            placeholder="Количество активаций"
                        />
                    </label> : null
                    }
                    <div className="checkbox-container popup__checkbox-container">
                        <input  defaultChecked={+curPromo.activations_count === -1} onChange={(e) => {
                           setCurPromo({
                                ...curPromo,
                                activations_count: (e.target as HTMLInputElement).checked ? '-1' : ''
                           }) 
                        }} type="checkbox" className="checkbox" id="checkbox-10931"/>
                        <label htmlFor="checkbox-10931" className="popup__checkbox-label checkbox-label">Неограниченные активации</label>
                    </div>
                    <label htmlFor="editor__input-name-019303" className="input popup__input">
                        <span className="input__label">Процент скидки</span>
                        <input 
                            onInput={(e) => setCurPromo({
                                ...curPromo,
                                sale_percent: (e.target as HTMLInputElement).value
                            })}
                            value={curPromo.sale_percent || ''}
                            type="text" 
                            id="editor__input-name-019303" 
                            className="input__text" 
                            placeholder="Процент скидки"
                        />
                    </label>
                    <button 
                        onClick={() => action === 'post' ? postPromo() : editPromo(curPromo.id)} 
                        className="btn popup__btn" style={{marginTop: '25px'}}
                    >Применить</button>
                </div>
            </Popup>
            <div className="promocodes admin__block">
                <div className="promocodes__header">
                    <label htmlFor="promocodes__search-input" className="promocodes__search">
                        <img src={SearchIcon} alt="поиск" className="promocodes__search-icon" />
                        <input type="text" id="promocodes__search-input" placeholder="Поиск" className="promocodes__search-input"/>
                    </label>
                </div>
                <div className="promocodes__items">
                    <div className="promocodes__items-header">
                        <span className="promocodes__text">Промокод</span>
                        <span className="promocodes__text">Процент скидки</span>
                        <span className="promocodes__text">Информация</span>
                        <span className="promocodes__text">Действия</span>
                    </div>
                    {
                        promocodes?.length ? promocodes.map(({id, name, sale_percent, activations_count, usage_count}, i) => {
                            return (
                                <div key={id} className="promocodes__item">
                                    <span className="promocodes__text promocodes__text_bold">{name}</span>
                                    <span className="promocodes__text">{sale_percent}%</span>
                                    <span className="promocodes__text">
                                        Количество использований: {activations_count > -1 ? activations_count : 'неограниченно'} <br />Активировано: {usage_count || 0} раз
                                    </span>
                                    <div className="promocodes__item-helpers">
                                        <div onClick={() => {
                                            setAction('edit')
                                            setCurPromo({
                                                id,
                                                name,
                                                sale_percent: sale_percent+'',
                                                activations_count: activations_count+'',
                                            });
                                            setIsCreatePromoPopupOpened(true);
                                        }} className="promocodes__item-helper">
                                            <img src={OptionsIcon} alt="настроить" className="promocodes__helper-icon" />
                                        </div>
                                        <div onClick={() => deletePromo(id, i)} className="promocodes__item-helper">
                                            <img src={TrashIcon} alt="удалить" className="promocodes__helper-icon" />
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : 
                        <span className="promocodes__emptyness">Промокодов нет</span>
                    }
                    
                </div>
            </div>
        </>
    );
}
 
export default Promocodes;