import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'; 
import { useNavigate } from "react-router-dom";

import BackArrow from "../../../assets/images/icons/arrow_left.svg";
import DropdownArrow from "../../../assets/images/icons/dropdown_white.svg";
import EditIcon from "../../../assets/images/icons/edit_white.svg";
import EditBlackIcon from "../../../assets/images/icons/edit.svg";
import RubIcon from "../../../assets/images/icons/rub.svg";
import PlusIcon from "../../../assets/images/icons/plus_black.svg";
import UploadIcon from "../../../assets/images/icons/upload.svg";
import SaveIcon from "../../../assets/images/icons/save.svg";
import SaveBlueIcon from "../../../assets/images/icons/save_blue.svg";
import TrashIcon from "../../../assets/images/icons/trash.svg";

import AdminHeader from "../../../components/adminHeader/adminHeader";
import Popup from "../../../components/categoryPopup/categoryPopup";

import { PostProductI, SubcategoryI } from "../../../interfaces";
import { getData, postData, uploadFile } from "../../../services/services";

import { addSnack } from "../../../redux/snackbarSlice";

import { LoaderT } from "../../../types";
import Loader from "../../../components/loader/loader";
import './editProduct.scss';

interface EditProductPropsI {
    title: string
}
 
const EditProduct: FC<EditProductPropsI> = ({title}) => {
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [productData, setProductData] = useState<PostProductI>({
        id: -1,
        title: '',
        description: '',
        card_price: '',
        options: [],
        parameters: [],
        subcategory_id: 0,
        product_photos: [],
        initialPhotos: []     
    });
    const [initialProductData, setInitialProductData] = useState<PostProductI>({
        id: -1,
        title: '',
        description: '',
        card_price: '',
        options: [],
        parameters: [],
        subcategory_id: 0,
        product_photos: [],
        initialPhotos: []     
    });

    const [alertMessages, setAlertMessages] = useState({
        options: '',
        params: ''
    });
    const [curOption, setCurOption] = useState({
        id: -1,
        title: '',
        value: '',
        is_pk: false
    });
    const [curParam, setCurParam] = useState({
        id: -1,
        data: [] as string[],
        has_sale: false,
        sale_price: '',
        price: '',
        title: '',
        description: '',
        give_type: 'hand'
    });

    const [subcategories, setSubcategories] = useState<SubcategoryI[]>([]);
    const [isOptionPopupOpened, setIsOptionPopupOpened] = useState<boolean>(false);
    const [editableOption, setEditableOption] = useState<number>(-1);
    const [isParamPopupOpened, setIsParamPopupOpened] = useState<boolean>(false);
    const [editableParam, setEditableParam] = useState<number>(-1);
    const [isRowAdded, setIsRowAdded] = useState<boolean>(false);
    const [newRow, setNewRow] = useState<string>('');
    const [isSubcatDropdownOpened, setIsSubcatDropdownOpened] = useState<boolean>(false);
    const [isDataLoaded, setIsDataLoaded] = useState<{
        product: LoaderT
        txtFiles: LoaderT
    }>({
        product: 'idle',
        txtFiles: 'idle'
    });

    

    const createOption = () => {
        if(!curOption.title.length) {
            setAlertMessages({
                ...alertMessages,
                options: 'Введите название'
            });

            return;
        }

        if(!curOption.value.length) {
            setAlertMessages({
                ...alertMessages,
                options: 'Введите значение'
            });

            return;
        }

        if(productData.options.filter(opt => opt.title === curOption.title).length > 0) {
            setAlertMessages({
                ...alertMessages,
                options: 'Характеристика с таким названием уже существует'
            });

            return; 
        }

        setProductData({
            ...productData,
            options: [
                ...productData.options,
                {
                    id: curOption.id,
                    title: curOption.title,
                    value: curOption.value,
                    is_pk: curOption.is_pk
                }
            ]
        });

        setCurOption({
            id: -1,
            title: '',
            value: '',
            is_pk: false
        })

        setIsOptionPopupOpened(false);
    }

    const editOption = () => {
        const matchArr = productData.options.filter(opt => opt.title === curOption.title.trim().toLocaleLowerCase());
        if(matchArr.length && matchArr[0]?.id !== curOption.id) {
            setAlertMessages({
                ...alertMessages,
                options: 'Характеристика с таким названием уже существует'
            });

            return; 
        }

        const editableOptionRef = productData.options[editableOption];
        editableOptionRef.title = curOption.title;
        editableOptionRef.value = curOption.value;

        setIsOptionPopupOpened(false);
        setEditableOption(-1);
    }

    const createParam = () => {
        if(!curParam.title.length) {
            setAlertMessages({
                ...alertMessages,
                params: 'Введите название'
            });

            return;
        }

        if(productData.parameters.filter(par => par.title === curParam.title.trim().toLocaleLowerCase()).length > 0) {
            setAlertMessages({
                ...alertMessages,
                params: 'Параметр с таким названием уже существует'
            });

            return; 
        }

        setProductData({
            ...productData,
            parameters: [
                ...productData.parameters,
                {
                    id: productData.parameters.length,
                    title: curParam.title,
                    has_sale: curParam.has_sale,
                    price: curParam.price,
                    sale_price: curParam.sale_price,
                    description: curParam.description,
                    give_type: curParam.give_type,
                    data: curParam.data
                }
            ]
        });

        setCurParam({
            id: -1,
            title: '',
            price: '',
            sale_price: '',
            has_sale: false,
            data: [],
            description: '',
            give_type: 'hand'
        });

        setEditableParam(productData.parameters.length)
        setIsParamPopupOpened(false);
    }

    const editParam = async () => {
        const paramsArrRef = productData.parameters;
        paramsArrRef[paramsArrRef.indexOf(paramsArrRef.filter(par => par.id === editableParam)[0])] = {
            title: curParam.title,
            price: curParam.price,
            sale_price: curParam.sale_price,
            has_sale: curParam.has_sale,
            id: editableParam,
            data: curParam.data,
            description: curParam.description,
            give_type: curParam.give_type
        };

        setCurParam({
            id: -1,
            title: '',
            price: '',
            sale_price: '',
            has_sale: false,
            data: [],
            description: '',
            give_type: 'hand'
        });
        setEditableParam(-1);

        setProductData({
            ...productData,
            parameters: [...paramsArrRef]
        });

        setIsParamPopupOpened(false);
    };

    const saveRow = () => {
        const paramsArrRef = productData.parameters;
        const matchedParam = paramsArrRef[paramsArrRef.indexOf(paramsArrRef.filter(par => par.id === editableParam)[0])];

        if(matchedParam?.data?.filter(par => par === newRow).length > 0) {
            dispatch(addSnack({text: 'Ключ существует'}));
            return
        }

        if(newRow.length) {
            setCurParam({
                ...curParam,
                data: [
                    ...curParam.data,
                    newRow
                ]
            });
        }

        setNewRow('');
        setIsRowAdded(false);
    }

    const saveKeys = () => {
        const paramsArrRef = productData.parameters;
        const {id, title, price, sale_price, has_sale, data, give_type, description} = curParam;
        
        paramsArrRef[paramsArrRef.indexOf(paramsArrRef.filter(par => par.id === editableParam)[0])] = {
            id,
            title,
            price,
            sale_price,
            has_sale,
            data,
            description,
            give_type
        } 

        setProductData({
            ...productData,
            parameters: paramsArrRef
        });
        setEditableParam(id);
        console.log(productData.parameters)
        dispatch(addSnack({text: "Ключи успешно сохранены"}));
    }

    const removeKey = (key: string) => {
        setCurParam({
            ...curParam,
            data: curParam.data.filter(item => item !== key)
        })
    }

    const updateProduct = async () => {
        const {id, title, card_price, description, options, parameters, product_photos, subcategory_id} = productData;

        if(!title.length) {
            dispatch(addSnack({text: 'Не заполнено имя товара'}));
            return;
        }

        if(!card_price.length) {
            dispatch(addSnack({text: 'Не заполнена цена'}));
            return;
        }

        if(isNaN(+card_price)) {
            dispatch(addSnack({text: 'Некорректное значение цены'}));
            return;
        }

        if(!product_photos.length && id === -1) {
            dispatch(addSnack({text: 'Не выбрано ни одного фото товара'}));
            return;
        }

        let areParamsOk = true;
        parameters.forEach(param => {
            if((!param.data?.length) && param.give_type !== 'hand') {
                dispatch(addSnack({text: `Не установлены ключи для параметра: ${param.title}`}));
                areParamsOk = false;
                return;
            }

            if(isNaN(+param.price) || (param.has_sale && isNaN(+param.sale_price))) {
                dispatch(addSnack({text: `Некорректное значение цены для параметра: ${param.title}`}));
                areParamsOk = false;
                return;
            }

            if(!param.price) {
                dispatch(addSnack({text: `Не указана цена для параметра: ${param.title}`}));
                areParamsOk = false;
                return;
            }
        });

        if(!areParamsOk) return;

        if(product_photos[1]?.length > 4) {
            dispatch(addSnack({text: 'Добавьте не более 4-х фото'}));
            return;
        }

        setIsDataLoaded({
            ...isDataLoaded,
            product: 'processing'
        });

        for(let option of options) {
            await fetch(baseURL + `/option/${option.id}`, {
                method: 'PATCH',
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' +  window.localStorage.getItem('access_token') as string,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: option.title,
                    value: option.value,
                    is_pk: option.is_pk
                })
            });
        }

        for(let {id, title, price, has_sale, sale_price, data, give_type, description} of parameters) {
            if(initialProductData.parameters.map(param => param.id).includes(id)) {
                await fetch(baseURL + `/parameter/${id}`, {
                    method: 'PATCH',
                    headers: {
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' +  window.localStorage.getItem('access_token') as string,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        price,
                        has_sale,
                        sale_price,
                        give_type,
                        description
                    })
                });
    
                await fetch(baseURL + `/parameter/${id}/data`, {
                    method: 'PATCH',
                    headers: {
                        "Accept": "application/json",
                        "Authorization": 'Bearer ' +  window.localStorage.getItem('access_token') as string,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
            } else {
                await postData(`/product/${productData.id}/parameters`, {
                    title,
                    price,
                    has_sale,
                    sale_price,
                    give_type,
                    description,
                    data
                }, true)
            }
        }

        if(product_photos.length) {

            if(product_photos[0]) {
                await uploadFile(product_photos[0][0]).then(async (data) => {
                    await fetch(baseURL + `/photo/${productData.initialPhotos[0].id}`, {
                        method: 'PATCH',
                        headers: {
                            "Accept": "application/json",
                            "Authorization": 'Bearer ' +  window.localStorage.getItem('access_token') as string,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            photo: data.upload,
                            main: true
                        })
                    })
                })
            }

            if(!product_photos[1]?.length) return;
    
            Array.from(product_photos[1]).forEach(async (item, i) => {
                const curPhoto = productData.initialPhotos[i+1];
                if(curPhoto === undefined) {
                    await uploadFile(item)
                    .then(async (data) => {
                        await postData(`/product/${id}/photos`, {
                            photo: data.upload
                        }, true)
                    })
                } else {
                    await uploadFile(item).then(async (data) => {
                    await fetch(baseURL + `/photo/${curPhoto.id}`, {
                        method: 'PATCH',
                        headers: {
                            "Accept": "application/json",
                            "Authorization": 'Bearer ' +  window.localStorage.getItem('access_token') as string,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            photo: data.upload,
                            main: false
                        })
                    })
                })
                }

                
                
            })
        }

        await fetch(baseURL + `/product/${id}`, {
            method: 'PATCH',
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' +  window.localStorage.getItem('access_token') as string,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                card_price,
                subcategory_id
            })
        });
       
        setIsDataLoaded({
            ...isDataLoaded,
            product: 'done'
        });

        navigate('/admin/products');

    }

    const uploadProduct = async () => {
        const {id, title, card_price, description, options, parameters, product_photos, subcategory_id} = productData;

        if(!title.length) {
            dispatch(addSnack({text: 'Не заполнено имя товара'}));
            return;
        }

        if(!card_price.length) {
            dispatch(addSnack({text: 'Не заполнена цена'}));
            return;
        }

        if(isNaN(+card_price)) {
            dispatch(addSnack({text: 'Некорректное значение цены'}));
            return;
        }

        if(!product_photos.length && id === -1) {
            dispatch(addSnack({text: 'Не выбрано ни одного фото товара'}));
            return;
        }

        let areParamsOk = true;
        parameters.forEach(param => {
            if((!param.data?.length) && param.give_type !== 'hand') {
                dispatch(addSnack({text: `Не установлены ключи для параметра: ${param.title}`}));
                areParamsOk = false;
                return;
            }

            if(isNaN(+param.price) || (param.has_sale && isNaN(+param.sale_price))) {
                dispatch(addSnack({text: `Некорректное значение цены для параметра: ${param.title}`}));
                areParamsOk = false;
                return;
            }

            if(!param.price) {
                dispatch(addSnack({text: `Не указана цена для параметра: ${param.title}`}));
                areParamsOk = false;
                return;
            }
        });

        if(!areParamsOk) return;

        const paramsArrRef = parameters.map(({title, price, description, has_sale, give_type, sale_price, data}) => {
            return {
                title: title.trim(),
                price: price.trim(),
                has_sale,
                sale_price,
                description,
                data,
                give_type
            }
        });

        let newPhotosArray: Array<{photo: string}> = []

        for(let k in product_photos) {
            for(let i in product_photos[k]) {
                if(typeof product_photos[k][i] === 'object') {
                    await uploadFile(product_photos[k][i])
                    .then(data => {
                        newPhotosArray = [
                            ...newPhotosArray,
                            {
                                photo: data.upload
                            }
                        ]
                    })
                }
            }
        };
        
        setIsDataLoaded({
            ...isDataLoaded,
            product: 'processing'
        });

        await postData('/product', {
            title: title.trim(),
            card_price: card_price.trim(),
            description: description.trim(),
            options,
            photos: newPhotosArray.map(item => item.photo),
            subcategory_id,
            parameters: paramsArrRef
        }, true)
        .then(data => {
            navigate('/admin/products')
        })
        .finally(() => {
            setIsDataLoaded({
                ...isDataLoaded,
                product: 'done'
            });
        })
        

    }

    const uploadFiles = async (list: FileList) => {
        for (let i of Object.keys(list)) {
            const data = await uploadFile(list[+i]);
            setCurParam(prevState => ({
                ...prevState,
                data: [...prevState.data, data.upload]
            }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getData('/subcategories?empty_filter=false', true)
            .then((data: SubcategoryI[]) => {
                setSubcategories(data);

                setProductData({
                    ...productData,
                    subcategory_id: data[0].id
                })
            });
            
            const loc = window.location.href;

            if(loc.includes('products/edit')) {
                await getData(`/product/${loc.substring(loc.lastIndexOf('/')+1, loc.length)}`, true)
                .then((data: PostProductI) => {
                    setProductData({
                        id: data.id,
                        title: data.title,
                        card_price: data.card_price,
                        options: data.options,
                        parameters: data.parameters,
                        description: data.description,
                        initialPhotos: [
                            data.product_photos[0],
                            ...data.product_photos.splice(1, data.product_photos.length)
                        ],
                        product_photos: [],
                        subcategory_id: data.subcategory_id
                    })

                    setInitialProductData({
                        id: data.id,
                        title: data.title,
                        card_price: data.card_price,
                        options: data.options,
                        parameters: data.parameters,
                        description: data.description,
                        initialPhotos: [
                            data.product_photos[0],
                            ...data.product_photos.splice(1, data.product_photos.length)
                        ],
                        product_photos: [],
                        subcategory_id: data.subcategory_id
                    })
                });
                
            }
        }

        fetchData()
    }, []);

    useEffect(() => {
        setAlertMessages({
            options: '',
            params: ''
        });
    }, [curOption]);

    useEffect(() => {
        if(productData.id === -1) return;

        getData(`/product/${productData.id}/data`, true)
        .then(data => {
            let paramsArrRef = productData.parameters;
            paramsArrRef = paramsArrRef.map(par => {
                if(par.give_type === 'file') {
                    return {
                        ...par,
                        data: [
                            ...par.data || [],
                            ...data.filter((item: {parameter_id: number, data: string[]}) => item.parameter_id === par.id)[0].items.map((item: string) => item)
                        ]
                    }
                }

                if(par.give_type === 'hand') {
                    return {
                        ...par,
                        data:[]
                    }
                }

                return {
                    ...par,
                    data: data.filter((item: {parameter_id: number, data: string[]}) => item.parameter_id === par.id)[0].items
                };
            });

            setProductData({
                ...productData,
                parameters: paramsArrRef
            });
        })
    }, [productData.id]);
 
    useEffect(() => {
        setIsSubcatDropdownOpened(false);
    }, [productData.subcategory_id])

    useEffect(()=> {
        const matchedParam = productData.parameters.filter(par => par.id === editableParam)[0];

        setCurParam({
            id: matchedParam?.id,
            title: matchedParam?.title,
            data: matchedParam?.data || [],
            sale_price: matchedParam?.sale_price,
            has_sale: matchedParam?.has_sale,
            price: matchedParam?.price,
            description: matchedParam?.description,
            give_type: matchedParam?.give_type || 'hand'
        });        
    }, [editableParam]);

    return (
        <>
            <AdminHeader title={title}>
                <button onClick={() => navigate(-1)} className="btn admin__btn">
                    <img src={BackArrow} alt="назад" />
                    Назад
                </button>   
                <button onClick={() => navigate('/admin/categories')} className="btn admin__btn">
                    Настроить категории
                    <img src={EditIcon} alt="Настроить категории" />
                </button>
                <div className="admin__dropdown">
                    <button onClick={() => setIsSubcatDropdownOpened(!isSubcatDropdownOpened)} className="btn admin__btn">
                        Подкатегория:&nbsp;
                        {
                            subcategories.filter(subcat => subcat.id === productData.subcategory_id)[0]?.title || 
                            subcategories[0]?.title
                        }
                        <img 
                            src={DropdownArrow} 
                            alt="Категория: Операционные системы" 
                            className={`admin__btn-icon ${isSubcatDropdownOpened ? 'admin__btn-icon_rotated' : ''}`}
                        />
                    </button>
                    {
                        subcategories.length && isSubcatDropdownOpened && <ul className="list admin__dropdown-list">
                            {
                                subcategories.map(({id, title}) => {
                                    return (
                                    <li 
                                        key={id} 
                                        onClick={() => {
                                            setIsSubcatDropdownOpened(false)
                                            setProductData({
                                                ...productData,
                                                subcategory_id: id
                                            })
                                            }
                                        } 
                                        className="admin__dropdown-item"
                                    >
                                        {title}
                                    </li>
                                    )
                                })
                            }
                        </ul>
                    }
                </div>
                
            </AdminHeader>
           
            <Popup isPopupOpened={isOptionPopupOpened} setIsPopupOpened={setIsOptionPopupOpened}>
                <h3 className="popup__title title">Настройка характеристики</h3>
                <div className="popup__body">
                    <label htmlFor="editor__input-name-345213345" className="input popup__input">
                        <span className="input__label">Характеристика</span>
                        <input 
                            onInput={(e) => setCurOption({
                                ...curOption,
                                title: (e.target as HTMLInputElement).value
                            })}
                            value={curOption.title}
                            type="text" 
                            id="editor__input-name-345213345" 
                            className="input__text" 
                            placeholder="Характеристика"
                        />
                    </label>
                    <label htmlFor="editor__input-value-1410" className="input popup__input">
                        <span className="input__label">Значение</span>
                        <input 
                            onInput={(e) => setCurOption({
                                ...curOption,
                                value: (e.target as HTMLInputElement).value
                            })}
                            value={curOption.value}
                            type="text" 
                            id="editor__input-value-1410" 
                            className="input__text" 
                            placeholder="Значение"
                        />
                    </label>
                    <div className="checkbox-container popup__checkbox-container">
                        <input checked={curOption.is_pk} onClick={(e) => setCurOption({
                            ...curOption,
                            is_pk: (e.target as HTMLInputElement).checked
                        })} type="checkbox" className="checkbox" id="checkbox-02391"/>
                        <label htmlFor="checkbox-02391" className="popup__checkbox-label checkbox-label">Использовать как ID</label>
                    </div>
                    <span className="text popup__alert">{alertMessages.options}</span>
                    <button className="btn popup__btn" onClick={() => {
                        editableOption === -1 ? createOption() : editOption()}}>Применить</button>
                </div>
                <p className="popup__notification">
                    При использовании как ID - данное значение больше нельзя применить ни к одному товару
                </p>
            </Popup>
            <Popup isPopupOpened={isParamPopupOpened} setIsPopupOpened={setIsParamPopupOpened}>
                <h3 className="popup__title title">Настройка параметра</h3>
                <div className="popup__content">
                    <div className="popup__body">
                        <label htmlFor="editor__input-name-305492" className="input popup__input">
                            <span className="input__label">Название парметра</span>
                            <input 
                                onInput={(e) => {
                                    setCurParam({
                                        ...curParam,
                                        title: (e.target as HTMLInputElement).value
                                    });
                                }}
                                value={curParam.title}
                                type="text" 
                                id="editor__input-name-305492" 
                                className="input__text" 
                                placeholder="Название параметра"
                            />
                        </label>
                        <label htmlFor="editor__input-value-1410" className="input popup__input">
                            <span className="input__label">Цена (₽)</span>
                            <input 
                                onInput={(e) => {
                                    setCurParam({
                                        ...curParam,
                                        price: (e.target as HTMLInputElement).value
                                    });
                                }}
                                value={curParam.price}
                                type="text" 
                                id="editor__input-value-1410" 
                                className="input__text" 
                                placeholder="Цена (₽)"
                            />
                        </label>
                        <div className="checkbox-container popup__checkbox-container">
                            <input  defaultChecked={curParam.has_sale} onClick={(e) => {setCurParam({
                                ...curParam,
                                has_sale: (e.target as HTMLInputElement).checked
                            })}} type="checkbox" className="checkbox" id="checkbox-59102"/>
                            <label htmlFor="checkbox-59102" className="popup__checkbox-label checkbox-label">Есть скидка</label>
                        </div>
                        {curParam.has_sale && <label htmlFor="editor__input-value-8952" className="input popup__input">
                            <span className="input__label">Цена со скидкой (₽)</span>
                            <input 
                                onInput={(e) => {
                                    setCurParam({
                                        ...curParam,
                                        sale_price: (e.target as HTMLInputElement).value
                                    });
                                }}
                                value={curParam.sale_price}
                                type="text" 
                                id="editor__input-value-8952" 
                                className="input__text" 
                                placeholder="Цена со скидкой (₽)"
                            />
                        </label>}
                        <span className="text popup__alert">{alertMessages.params}</span>
                        <button onClick={() => editableParam >= 0 ? editParam() : createParam()} className="btn popup__btn">Применить</button>
                    </div>
                    <div className="popup__body popup__description">
                        <label htmlFor="editor__input-value-1410313" className="input popup__inpu popup__textarea">
                            <span className="input__label">Введите описание товара</span>
                            <textarea
                                onInput={(e) => setCurParam({
                                    ...curParam,
                                    description: (e.target as HTMLInputElement).value
                                })}
                                value={curParam.description}
                                id="editor__input-value-1410313" 
                                className="input__text input__textarea"
                            >
                            </textarea>
                        </label>
                        <div className="popup__description-footer">
                            <button className="popup__description-btn">B</button>
                            <button 
                                className="popup__description-btn popup__description-btn_bold"
                            >B</button>
                            <button 
                                className="popup__description-btn popup__description-btn_italic"
                            >B</button>
                            Пример текста
                        </div>
                    </div>
                </div>
            </Popup>
            <div className="admin__block editor">
                <div className="editor__col">
                    <div className="editor__info">
                        <h2 className="editor__title editor__info-title">Основная информация</h2>
                        <div className="editor__data">
                            <label htmlFor="editor__input-name-7928" className="input editor__input">
                                <span className="input__label">Название товара</span>
                                <input 
                                    onInput={(e) => setProductData({
                                        ...productData,
                                        title: (e.target as HTMLInputElement).value
                                    })}
                                    value={productData.title}
                                    type="text" 
                                    id="editor__input-name-7928" 
                                    className="input__text editor__input-text" 
                                    placeholder="Название товара"
                                />
                            </label>
                            <label htmlFor="editor__input-price" className="input editor__input">
                                <span className="input__label">Цена (на карточке)</span>
                                <input 
                                    onInput={(e) => setProductData({
                                        ...productData,
                                        card_price: (e.target as HTMLInputElement).value
                                    })}
                                    value={productData.card_price}
                                    type="text" 
                                    id="editor__input-price" 
                                    className="input__text editor__input-text" 
                                    placeholder="Цена (на карточке)"
                                />
                            </label>
                            <button className="btn editor__data-currency">
                                <img src={RubIcon} alt="рубль" />
                                <img src={DropdownArrow} alt="открыть" className="editor__data-currency-opener"/>
                            </button>
                            <label htmlFor="editor__descr-input" className="input editor__descr">
                                <span className="input__label">Описание товара</span>
                                <textarea 
                                    onInput={(e) => setProductData({
                                        ...productData,
                                        description: (e.target as HTMLInputElement).value
                                    })}
                                    value={productData.description}
                                    name="admin-product-descr" 
                                    id="editor__descr-input" 
                                    className="editor__descr-input input__text"
                                >
                                </textarea>
                            </label>
                        </div>
                    </div>
                    <section className="editor__tags">
                        <div className="editor__tags-header">
                            <h2 className="editor__title">Характеристики</h2>
                            <div className="editor__tag" onClick={() => {
                                setEditableOption(-1);
                                setCurOption({
                                    id: productData.options.length,
                                    title: '',
                                    value: '',
                                    is_pk: false
                                });
                                setIsOptionPopupOpened(true);
                            }}>
                                Создать характеристику
                                <img src={PlusIcon} alt="Создать характеристику" />
                            </div>
                        </div>
                        <div className="editor__tags-items">
                            {
                                productData.options.length ? productData.options.map(({id, title, value, is_pk}, i) => {
                                    return (
                                        <div data-id={id || i} key={title} onClick={() => {
                                            setEditableOption(i);
                                            setCurOption({
                                                id: id || i,
                                                title,
                                                value,
                                                is_pk: is_pk || false
                                            })
                                            setIsOptionPopupOpened(true);
                                        }} className="editor__tag">
                                            {title}: {value}
                                            <img src={EditBlackIcon} alt={`${title}: ${value}`} className="editor__tag-icon"/>
                                        </div>
                                    )
                                }) : ''
                            }
                            
                        </div>
                    </section>
                    <section className="editor__tags">
                        <div className="editor__tags-header">
                            <h2 className="editor__title">Параметры</h2>
                            <div onClick={() => {
                                setCurParam({
                                    id: -1,
                                    title: '',
                                    price: '',
                                    sale_price: '',
                                    data: [],
                                    has_sale: false,
                                    description: '',
                                    give_type: 'hand'
                                });
                                setEditableParam(-1)
                                setIsParamPopupOpened(true);
                            }} className="editor__tag">
                                Создать параметр
                                <img src={PlusIcon} alt="Создать параметр" />
                            </div>
                        </div>
                        <div className="editor__tags-items">
                            {
                                productData.parameters.length ? productData.parameters.map(({id, title}, i) => {
                                    return (
                                        <div className="editor__tag-wrapper">
                                            <div key={id} onClick={() => setEditableParam(id)} className="editor__tag editor__param">
                                                {title}
                                            </div>
                                            <button onClick={() => {
                                                setEditableParam(id)
                                                setIsParamPopupOpened(true)
                                            }} className="editor__tag-btn btn">
                                                <img src={EditIcon} alt="редактировать"/>
                                            </button>
                                        </div>
                                    )
                                }) : ''
                            }
                            
                        </div>
                    </section>
                    <div className="editor__photos">
                        <div className="editor__photos-col">
                            <h2 className="editor__title">Фотографии (не более 4-х)</h2>
                            <label htmlFor="file-sender__input-70" className="file-sender editor__photos-file">
                                <input 
                                    onChange={(e) => setProductData({
                                        ...productData,
                                        product_photos: [
                                            productData.product_photos[0],
                                            (e.target as HTMLInputElement).files as FileList
                                        ]
                                    })} 
                                    multiple 
                                    type="file" 
                                    accept="image/png, image/jpeg" 
                                    id="file-sender__input-70"
                                    className="file-sender__input" 
                                />
                                <img src={UploadIcon} alt="Прикрепите сюда файлы" />
                                {
                                    productData.product_photos[1] && productData.product_photos[1].length ? 
                                    Object.keys(productData.product_photos[1]).map(key => productData.product_photos[1][+key].name + ' ') : 
                                    'Прикрепите сюда файлы'
                                }
                            </label>
                            <span className="editor__photos-allowed">Доступна загрузка файлов форматов: .jpg, .jpeg, .png</span>
                        </div>
                        <div className="editor__photos-col">
                            <h2 className="editor__title">Главная</h2>
                            <label htmlFor="file-sender__input-842" className="file-sender editor__photos-file editor__photos-file_empty">
                                <input 
                                    onChange={(e) => setProductData({
                                        ...productData,
                                        product_photos: [
                                            (e.target as HTMLInputElement).files as FileList ,
                                            productData.product_photos[1]
                                        ]
                                    })} 
                                    type="file" 
                                    accept="image/png, image/jpeg" 
                                    id="file-sender__input-842" 
                                    className="file-sender__input" 
                                />
                                <img src={UploadIcon} alt="Прикрепите сюда файлы" />
                                {productData.product_photos[0] && productData.product_photos[0].length && productData.product_photos[0][0].name || ''}
                            </label>
                        </div>
                    </div>
                    {
                        isDataLoaded.product !== 'processing' ? 
                            <button onClick={() => productData.id > -1 ? updateProduct() : uploadProduct()} className="btn admin__btn">
                                <img src={SaveIcon} alt="сохранить" />
                                Сохранить товар
                            </button> : <Loader additionalClass="editor__loader"/>
                    }
                    
                </div>
                <div className="editor__col editor__accounts desktop-block">
                    <h2 className="editor__title">Данные от аккаунтов</h2>
                    {
                        productData.parameters.length && curParam.id > -1 ? 
                        <>
                            <div className="editor__accounts-tabs">
                                <div 
                                    onClick={() => {
                                        setCurParam({
                                            ...curParam,
                                            give_type: 'string'
                                        });
                                    }}
                                    className={`editor__accounts-tab ${curParam.give_type === 'string' ? 'editor__accounts-tab_active' : ''}`}
                                >
                                    Строки
                                </div>
                                <div 
                                    onClick={() => {
                                        setCurParam({
                                            ...curParam,
                                            give_type: 'hand'
                                        });
                                    }}
                                    className={`editor__accounts-tab ${curParam.give_type === 'hand' ? 'editor__accounts-tab_active' : ''}`}>
                                    Ручная
                                </div>
                                <div 
                                    onClick={() => {
                                        setCurParam({
                                            ...curParam,
                                            give_type: 'file'
                                        });
                                    }}
                                    className={`editor__accounts-tab ${curParam.give_type === 'file' ? 'editor__accounts-tab_active' : ''}`}
                                >
                                    .txt
                                    
                                </div>
                            </div>
                        </> : null
                        
                    }
                    <div className="editor__accounts-data">
                        {
                            editableParam < 0 ? 
                            <div className="editor__params editor__params_empty">
                                Выберите параметр для настройки
                            </div> : ''
                        }
                        {
                           editableParam >= 0 && curParam.give_type === 'string' && 
                           <div className="editor__params">
                                <div className="editor__params-header">
                                    <button className="btn admin__btn">{productData.parameters.filter(par => par.id === editableParam)[0]?.title}</button>
                                    <img onClick={() => saveKeys()} src={SaveBlueIcon} className="editor__params-saver" alt="Сохранить ключи" />
                                </div>
                                <div className="editor__params-rows">
                                    <div className="editor__params-row">№ строки</div>
                                    {
                                        curParam.data?.map((key, i) => {
                                            return (
                                                <div key={key} className="editor__params-row">
                                                    {i+1 < 10 ? '0'+(i+1) : i+1}
                                                    <span className="editor__params-key">{key}</span>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        isRowAdded && 
                                        <div className="editor__params-new">
                                            <button onClick={() => setIsRowAdded(false)} className="btn editor__params-btn">-</button>
                                            <input 
                                                onInput={(e) => setNewRow((e.target as HTMLInputElement).value)} 
                                                autoFocus 
                                                type="text" 
                                                className="editor__params-input"
                                            />
                                        </div>
                                    }
                                </div>
                                {!isRowAdded && <div onClick={() => setIsRowAdded(true)} className="editor__params-appender">Добавить</div>}
                                {isRowAdded && <div onClick={() => saveRow()} className="editor__params-appender">Сохранить</div>}
                            </div>
                        }
                        {
                            editableParam >= 0 && curParam.give_type === 'hand' &&
                            <div className="editor__params">
                                <div className="editor__params-header">
                                    <button className="btn admin__btn">{productData.parameters.filter(par => par.id === editableParam)[0]?.title}</button>
                                </div>
                                <h2 className="editor__params-title">Включена ручная <br /> выдача товаров</h2>
                                <h3 className="editor__params-subtitle">Функции редактора недоступны</h3>
                            </div>
                        }
                        {
                            editableParam >= 0 && curParam.give_type === 'file' &&
                            <div className="editor__params">
                                <div className="editor__params-header">
                                    <button className="btn admin__btn">{productData.parameters.filter(par => par.id === editableParam)[0]?.title}</button>
                                    {
                                        isDataLoaded.txtFiles !== 'processing' ?
                                        <img onClick={() => saveKeys()} src={SaveBlueIcon} className="editor__params-saver" alt="Сохранить" /> : <Loader/>

                                    }
                                </div>
                                {
                                    !curParam.data.length ? (
                                        <>
                                            <h2 className="editor__params-title">Включена выдача <br /> по .txt</h2>
                                            <h3 className="editor__params-subtitle">Вам необходимо добавить файлы</h3>
                                        </>
                                    ) : (
                                        <div className="editor__files">
                                            {
                                                curParam.data.map(item => {
                                                    return (
                                                        <div key={item} className="editor__file">
                                                            <a target="blank" href={baseURL + '/uploads/' + item} className="editor__file-name">{item}</a>
                                                            <img onClick={() => removeKey(item)} src={TrashIcon} alt="удалить" className="editor__file-icon"/>
                                                        </div>
                                                    )
                                                })
                                            }       
                                        </div>
                                    )
                                }
                                <div className="editor__params-txt">
                                    <span className="editor__params-counter">
                                    </span>
                                    <label htmlFor="file-sender__input-25" className="file-sender file-sender_small">
                                        <input 
                                            onInput={async (e) => {
                                               await uploadFiles((e.target as HTMLInputElement).files as FileList)
                                            }}
                                            multiple
                                            type="file" 
                                            accept=".txt" 
                                            id="file-sender__input-25" 
                                            className="file-sender__input" 
                                        />
                                        <img src={UploadIcon} alt="Добавить .txt" />
                                        Добавить .txt
                                    </label>
                                </div>
                            </div>
                        }
                        
                    </div>
                </div>
                <div className="editor__col editor__accounts mobile-block">
                    <h2 className="editor__title">Данные от аккаунтов</h2>
                    {
                        productData.parameters.length && curParam.id > -1 ? 
                        <>
                            <div className="editor__accounts-tabs">
                                <div 
                                    onClick={() => {
                                        setCurParam({
                                            ...curParam,
                                            give_type: 'string'
                                        });
                                    }}
                                    className={`editor__accounts-tab ${curParam.give_type === 'string' ? 'editor__accounts-tab_active' : ''}`}
                                >
                                    Строки
                                </div>
                                <div 
                                    onClick={() => {
                                        setCurParam({
                                            ...curParam,
                                            give_type: 'hand'
                                        });
                                    }}
                                    className={`editor__accounts-tab ${curParam.give_type === 'hand' ? 'editor__accounts-tab_active' : ''}`}>
                                    Ручная
                                </div>
                                <div 
                                    onClick={() => {
                                        setCurParam({
                                            ...curParam,
                                            give_type: 'file'
                                        });
                                    }}
                                    className={`editor__accounts-tab ${curParam.give_type === 'file' ? 'editor__accounts-tab_active' : ''}`}
                                >
                                    .txt
                                    
                                </div>
                            </div>
                        </> : null
                        
                    }
                    <div className="editor__accounts-data">
                        {
                            editableParam < 0 ? 
                            <div className="editor__params editor__params_empty">
                                Выберите параметр для настройки
                            </div> : ''
                        }
                        {
                           editableParam >= 0 && curParam.give_type === 'string' && 
                           <div className="editor__params">
                                <div className="editor__params-header">
                                    <button className="btn admin__btn">{productData.parameters.filter(par => par.id === editableParam)[0]?.title}</button>
                                    <img onClick={() => saveKeys()} src={SaveBlueIcon} className="editor__params-saver" alt="Сохранить ключи" />
                                </div>
                                <div className="editor__params-rows">
                                    <div className="editor__params-row">№ строки</div>
                                    {
                                        curParam.data?.map((key, i) => {
                                            return (
                                                <div key={key} className="editor__params-row">
                                                    {i+1 < 10 ? '0'+(i+1) : i+1}
                                                    <span className="editor__params-key">{key}</span>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        isRowAdded && 
                                        <div className="editor__params-new">
                                            <button onClick={() => setIsRowAdded(false)} className="btn editor__params-btn">-</button>
                                            <input 
                                                onInput={(e) => setNewRow((e.target as HTMLInputElement).value)} 
                                                autoFocus 
                                                type="text" 
                                                className="editor__params-input"
                                            />
                                        </div>
                                    }
                                </div>
                                {!isRowAdded && <div onClick={() => setIsRowAdded(true)} className="editor__params-appender">Добавить</div>}
                                {isRowAdded && <div onClick={() => saveRow()} className="editor__params-appender">Сохранить</div>}
                            </div>
                        }
                        {
                            editableParam >= 0 && curParam.give_type === 'hand' &&
                            <div className="editor__params">
                                <div className="editor__params-header">
                                    <button className="btn admin__btn">{productData.parameters.filter(par => par.id === editableParam)[0]?.title}</button>
                                </div>
                                <h2 className="editor__params-title">Включена ручная <br /> выдача товаров</h2>
                                <h3 className="editor__params-subtitle">Функции редактора недоступны</h3>
                            </div>
                        }
                        {
                            editableParam >= 0 && curParam.give_type === 'file' &&
                            <div className="editor__params">
                                <div>
                                    <div className="editor__params-header">
                                        <button className="btn admin__btn">{productData.parameters.filter(par => par.id === editableParam)[0]?.title}</button>
                                        {
                                            isDataLoaded.txtFiles !== 'processing' ?
                                            <img onClick={() => saveKeys()} src={SaveBlueIcon} className="editor__params-saver" alt="Сохранить" /> : <Loader/>

                                        }
                                    </div>
                                    {
                                        !curParam.data.length ? (
                                            <>
                                                <h2 className="editor__params-title">Включена выдача <br /> по .txt</h2>
                                                <h3 className="editor__params-subtitle">Вам необходимо добавить файлы</h3>
                                            </>
                                        ) : (
                                            <div className="editor__files">
                                                {
                                                    curParam.data.map(item => {
                                                        return (
                                                            <div key={item} className="editor__file">
                                                                <a target="blank" href={baseURL + '/uploads/' + item} className="editor__file-name">{item}</a>
                                                                <img onClick={() => removeKey(item)} src={TrashIcon} alt="удалить" className="editor__file-icon"/>
                                                            </div>
                                                        )
                                                    })
                                                }       
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="editor__params-txt">
                                    {
                                        curParam.data.length ?
                                        (
                                            <span className="editor__params-counter">
                                                Добавлено {curParam.data.length} файлов
                                            </span>
                                        ) : null
                                    }
                                    <label htmlFor="file-sender__input-25" className="file-sender file-sender_small">
                                        <input 
                                            onInput={async (e) => {
                                               await uploadFiles((e.target as HTMLInputElement).files as FileList)
                                            }}
                                            multiple
                                            type="file" 
                                            accept=".txt" 
                                            id="file-sender__input-25" 
                                            className="file-sender__input" 
                                        />
                                        <img src={UploadIcon} alt="Добавить .txt" />
                                        Добавить .txt
                                    </label>
                                </div>
                            </div>
                        }
                        
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default EditProduct;