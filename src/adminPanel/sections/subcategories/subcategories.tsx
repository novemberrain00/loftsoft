import { FC, useEffect, useState, useRef, useContext } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TouchBackend } from 'react-dnd-touch-backend';

import RefreshIcon from "../../../assets/images/icons/refresh.svg";
import DragIcon from "../../../assets/images/icons/drag-dots.svg";
import SearchIcon from "../../../assets/images/icons/search.svg";
import PlusIcon from "../../../assets/images/icons/plus.svg";

import AdminHeader from "../../../components/adminHeader/adminHeader";
import Popup from "../../../components/categoryPopup/categoryPopup";
import { getCookie, getData, postData, uploadFile } from "../../../services/services";

import { CategoryI, SubcategoryI } from "../../../interfaces";
import AdminListItem from "../../../components/adminListItem/adminListItem";
import Loader from "../../../components/loader/loader";

import './subcategories.scss'; 

interface SubcategoriesPropsI {
    
}

interface NewSubcategoryI {
    id: number
    title: string
    category: string
    categoryId: number
}
 
const Subcategories: FC<SubcategoriesPropsI> = () => {
    const [isPopupOpened, setIsPopupOpened] = useState<boolean>(false);
    const [subcategoryData, setSubcategoryData] = useState<NewSubcategoryI>({
        id: -1,
        title: '',
        category: '',
        categoryId: -1
    });
    const [subcategories, setSubcategories] = useState<SubcategoryI[]>([]);
    const [initialSubcategoriesList, setInitialSubcategoriesList] = useState<SubcategoryI[]>([]);
    const [categories, setCategories] = useState<CategoryI[]>([]);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [isDropdownOpened, setIsDropdownOpened] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [subcategoryAction, setSubcategoryAction] = useState<'create' | 'edit'>('create');
    const [draggableList, setDraggableList] = useState(0);

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const createSubcategory = async () => {
        if(!subcategoryData.title) {
            setAlertMessage('Введите заголовок');
            return;
        }

        if(!subcategoryData.category) {
            setAlertMessage('Выберите категорию');
            return;
        }

        const doesCategoryExist = !!categories.filter(cat => cat.title.toLocaleLowerCase() === subcategoryData.category.trim().toLocaleLowerCase()).length;
        
        if(!doesCategoryExist) {
            setAlertMessage('Категория не найдена');
            return;
        }

        const doesSubcategoryExist = !!categories[
            categories.indexOf(categories.filter(cat => {
                return cat.id === subcategoryData.categoryId
            })[0])
        ].subcategories.filter(subcat => {
            return subcat.title.toLocaleLowerCase() === subcategoryData.title.trim().toLocaleLowerCase()
        }).length;

        if(doesSubcategoryExist) {
            setAlertMessage('Подкатегория с таким названием уже присутствует в данной категории');
            return;
        }

        if(subcategoryAction === 'create') {
            await postData('/subcategories', {
                title: subcategoryData.title.trim(),
                category_id: subcategoryData.categoryId
            }, true)
            .then(async () => {
                await getData('/categories?empty_filter=false', true)
                .then(data => setCategories(data));
                setIsPopupOpened(false);
            })
            .catch(() => setAlertMessage('Что-то пошло не так'));
        } else {
            await fetch(`${baseURL}/subcategory/${subcategoryData.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    title: subcategoryData.title,
                    category_id: subcategoryData.categoryId
                }),
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + getCookie('access_token') as string,
                    "Content-Type": "application/json"
                }
            }).then(() => {
                const subcategoriesArrRef = subcategories;
                
                subcategoriesArrRef[subcategoriesArrRef.indexOf(subcategories.filter(subcat => subcat.id === subcategoryData.id)[0])] = {
                    ...subcategoriesArrRef[subcategoriesArrRef.indexOf(subcategories.filter(subcat => subcat.id === subcategoryData.id)[0])],
                    title: subcategoryData.title,
                    category_id: subcategoryData.categoryId
                }

                setSubcategories(subcategoriesArrRef)
                setIsPopupOpened(false);
            })
        }

        
    }

    const deleteSubcategory = async (id: number) => {
        await fetch(baseURL + `/subcategory/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                Authorization: 'Bearer ' + getCookie('access_token') as string,
              }
        })
        .then(async () => {
            await getData('/categories?empty_filter=false', true)
            .then(data => setCategories(data));
        })

    }

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }

        const draggedElemIndex = result.source.index,
            replacedElemIndex = result.destination.index;

        const reorderedItems = Array.from(categories[draggableList].subcategories);
        const [removed] = reorderedItems.splice(draggedElemIndex, 1);
        reorderedItems.splice(replacedElemIndex, 0, removed);

        const catsArrRef = categories;
        catsArrRef[draggableList].subcategories = reorderedItems.map(item => {
            return subcategories.filter(subcat => subcat.id === item.id)[0]
        });

        const subCatsIdList = categories.map(cat => cat.subcategories.map(subcat => subcat.id));
        const subcatsListI = catsArrRef.map(cat => cat.subcategories)

        setSubcategories( ([] as SubcategoryI[]).concat(...subcatsListI));


        if(draggedElemIndex !== replacedElemIndex) {
            await postData('/subcategory/order', ([] as number[]).concat(...subCatsIdList), true)
        }
    };

    useEffect(() => {
        setAlertMessage('')
    }, [subcategoryData.title, subcategoryData.category])

    useEffect(() => {
        const fetchData = async () => {
            await getData('/categories?empty_filter=false', true)
            .then(data => setCategories(data));

            await getData('/subcategories?empty_filter=false', true)
            .then(data => {
                setSubcategories(data);
                setInitialSubcategoriesList(data);
            });
        }

        fetchData();
    }, []);

    useEffect(() => {
        const newSubcategories = initialSubcategoriesList.filter(subcat => subcat.title.toLowerCase().includes(searchQuery))
        setSubcategories(newSubcategories)
    }, [searchQuery])

    return (
        <>
            <AdminHeader title="Подкатегории">
                <button className="btn admin__btn" onClick={() => window.location.reload()}>
                    <img src={RefreshIcon} alt="Обновить" />
                    Обновить
                </button>
            </AdminHeader>
            <Popup isPopupOpened={isPopupOpened} setIsPopupOpened={setIsPopupOpened}>
                <h3 className="popup__title title">{subcategoryAction === 'create' ? 'Создание' : 'Редактирование'} подкатегории</h3>
                <div className="popup__body">
                    <label htmlFor="create-category-13039" className="input popup__input">
                        <span className="input__label">Название</span>
                        <input 
                            onInput={(e) => setSubcategoryData({
                                ...subcategoryData,
                                title: (e.target as HTMLInputElement).value
                            })} 
                            value={subcategoryData.title}
                            placeholder="Название" 
                            id="create-category-13039" 
                            type="text" 
                            className="input__text" 
                        />
                    </label>
                    <label htmlFor="create-category-13039" className="input popup__input">
                        <span className="input__label">Категория</span>
                        <input 
                            onFocus={() => setIsDropdownOpened(true)}
                            onInput={(e) => setSubcategoryData({
                                ...subcategoryData,
                                category: (e.target as HTMLInputElement).value
                            })} 
                            value={subcategoryData.category} 
                            placeholder="Категория" 
                            id="create-category-13039" 
                            type="text" 
                            className="input__text" 
                        />
                        {subcategoryData.category && isDropdownOpened && <ul className="popup__dropdown list">
                            {
                                categories.length && categories.filter(cat => cat.title.toLocaleLowerCase().includes(subcategoryData.category.toLocaleLowerCase())).map((cat, i) => {
                                    return (
                                    <li 
                                        key={cat.id} 
                                        className="popup__dropdown-item"
                                        onClick={() => {
                                            setSubcategoryData({
                                                ...subcategoryData,
                                                categoryId: cat.id,
                                                category: cat.title
                                            });

                                            setIsDropdownOpened(false);
                                        }}
                                    >
                                        {cat.title}
                                    </li>
                                    )
                                })
                            }
                        </ul>}
                            
                            
                    </label>
                    <span className="popup__alert text">{alertMessage}</span>
                    <button className="btn popup__btn" onClick={() => createSubcategory()}>{subcategoryAction === 'create' ? 'Создать' : 'Применить'}</button>
                </div>
            </Popup>
            <div className="admin__block subcategories">
                <div className="subcategories__header">
                    <div className="search subcategories__search">
                        <img src={SearchIcon} alt="поиск" className="search__icon subcategories__search-icon"/>
                        <input onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value.toLowerCase())} type="text" placeholder="Поиск" className="search__input" />
                    </div>
                    <button onClick={() => {
                        setSubcategoryData({
                            id: -1,
                            title: '',
                            category: '',
                            categoryId: -1
                        })
                        setSubcategoryAction('create');
                        setIsPopupOpened(true);
                    }} className="btn admin__btn">
                        <img src={PlusIcon} alt="Создать подкатегорию" />
                        Создать подкатегорию
                    </button>
                </div>
                {
                    categories.length ? categories.map(({id, subcategories, photo}, i) => {
                        return subcategories.length ? (
                            <ul key={id} className="list subcategories__list admin__list">
                                <DragDropContext onDragStart={() => setDraggableList(i)} backend={TouchBackend} onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {
                                            (provided: any) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {subcategories.map(({id, title, products, category_id}, i) => {
                                                        return <Draggable key={id} draggableId={id+''} index={i}>
                                                            {(provided: any) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    
                                                                >
                                                                    <AdminListItem
                                                                        dndHandler={
                                                                            <img src={DragIcon} {...provided.dragHandleProps} alt="перетащить" className="admin__list-drag"/>  
                
                                                                        }
                                                                        id={id}
                                                                        key={id}
                                                                        title={title}
                                                                        length={products.length}
                                                                        countItems="товаров"
                                                                        photo={photo}
                                                                        optionsClickHandler={() => {
                                                                            setSubcategoryData({
                                                                                id,
                                                                                title,
                                                                                categoryId: category_id,
                                                                                category: ''
                                                                            });
                                                                            setSubcategoryAction('edit');
                                                                            setIsPopupOpened(true);
                                                                        }}
                                                                        deleteItem={deleteSubcategory}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            )
                                        }
                                    </Droppable>
                                </DragDropContext>
                            </ul>
                        ) : null
                    }) : <Loader additionalClass="subcategories__loader"/>
                }
                
            </div>
        </>
    );
}
 
export default Subcategories;