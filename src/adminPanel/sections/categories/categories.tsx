import { FC, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

import RefreshIcon from "../../../assets/images/icons/refresh.svg";

import DragIcon from "../../../assets/images/icons/drag-dots.svg";
import SearchIcon from "../../../assets/images/icons/search.svg";
import PlusIcon from "../../../assets/images/icons/plus.svg";
import DownloadIcon from "../../../assets/images/icons/download_blue.svg";

import AdminHeader from "../../../components/adminHeader/adminHeader";
import Popup from "../../../components/categoryPopup/categoryPopup";
import { getCookie, getData, postData, uploadFile } from "../../../services/services";
import { CategoryI } from "../../../interfaces";

import AdminListItem from "../../../components/adminListItem/adminListItem";
import Loader from "../../../components/loader/loader";

import './categories.scss'; 

interface CategoriesPropsI {
    
}

interface NewCategoryI {
    id: number
    title: string
    photo: any
}
 
const Categories: FC<CategoriesPropsI> = () => {
    const [isPopupOpened, setIsPopupOpened] = useState<boolean>(false);
    const [categoryData, setCategoryData] = useState<NewCategoryI>({
        id: -1,
        title: '',
        photo: []
    });
    const [categories, setCategories] = useState<CategoryI[]>([]);
    const [categoriesInitialList, setCategoriesInitialList] = useState<CategoryI[]>([]);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [categoryAction, setCategoryAction] = useState<'create' | 'edit'>('create');

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }

        const draggedElemIndex = result.source.index,
            replacedElemIndex = result.destination.index;

        const reorderedItems = Array.from(categories);
        const [removed] = reorderedItems.splice(draggedElemIndex, 1);
        reorderedItems.splice(replacedElemIndex, 0, removed);

        if(draggedElemIndex !== replacedElemIndex) {
            setCategories(reorderedItems)
            await postData('/category/order', reorderedItems.map(cat => cat.id), true)
        }
    };

    const createCategory = async () => {
        if(!categoryData.title) {
            setAlertMessage('Введите заголовок')
            return;
        }

        if(!categoryData.photo.length) {
            setAlertMessage('Выберите фото')
            return;
        }
        const doesCategoryExist = !!categories.filter(cat => cat.title.toLocaleLowerCase() === categoryData.title.trim().toLocaleLowerCase()).length;
        
        if(doesCategoryExist) {
            setAlertMessage('Категория с таким названием существует');
            return;
        }

        const uploadedImg = await uploadFile(categoryData.photo[0]).then(data => data.upload)

        if(categoryAction === 'create') {
            await postData('/categories', {
                title: categoryData.title.trim(),
                photo: uploadedImg
            }, true)
            .then((data: CategoryI) => {
                setCategories([
                    ...categories,
                    data
                ]);
    
                setCategoryData({
                    id: -1,
                    title: '',
                    photo: []
                });
    
                setIsPopupOpened(false);
                setAlertMessage('');
            });
        } else {
            await fetch(`${baseURL}/category/${categoryData.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    title: categoryData.title,
                    photo: uploadedImg
                }),
                headers: {
                    "Accept": "application/json",
                    "Authorization": 'Bearer ' + getCookie('access_token') as string,
                    "Content-Type": "application/json"
                }
            })
            .then((data) => data.json())
            .then((data: CategoryI) => {
                const categoriesArrRef = categories;
                console.log(data)
                categoriesArrRef[categoriesArrRef.indexOf(categories.filter(cat => cat.id === categoryData.id)[0])] = {
                    ...categoriesArrRef[categoriesArrRef.indexOf(categories.filter(cat => cat.id === categoryData.id)[0])],
                    title: categoryData.title,
                    photo: data.photo
                }

                setCategories(categoriesArrRef);
                setIsPopupOpened(false);
            })
        }
    }

    const deleteCategory = async (id: number) => {
        await fetch(baseURL + `/category/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: "application/json",
                Authorization: 'Bearer ' + getCookie('access_token') as string,
              }
        })
        .then(() => {
            const categoriesArrRef = categories;
            categoriesArrRef.splice(categories.indexOf(categories.filter(cat => cat.id === id)[0]), 1);
            setCategories([...categoriesArrRef]);
        })

    }

    useEffect(() => {
        getData('/categories', true)
        .then(data => setCategories(data));
    }, []);

    useEffect(() => {
        const newCategories = categoriesInitialList.filter(cat => cat.title.toLowerCase().includes(searchQuery))
        setCategoriesInitialList(newCategories)
    }, [searchQuery])

    return (
        <>
            <AdminHeader title="Категории">
                <button className="btn admin__btn" onClick={() => window.location.reload()}>
                    <img src={RefreshIcon} alt="Обновить" />
                    Обновить
                </button>
            </AdminHeader>
            <Popup isPopupOpened={isPopupOpened} setIsPopupOpened={setIsPopupOpened}>
                <h3 className="popup__title title">{categoryAction === 'create' ? 'Создание' : 'Редактирование'} категории</h3>
                <div className="popup__body">
                    <label htmlFor="create-category-13039" className="input popup__input">
                        <span className="input__label">Название</span>
                        <input 
                            onInput={(e) => {
                                setCategoryData({
                                    ...categoryData,
                                    title: (e.target as HTMLInputElement).value
                                });
                                setAlertMessage('');
                            }} 
                            value={categoryData.title} 
                            placeholder="Название" 
                            id="create-category-13039" 
                            type="text" 
                            className="input__text" 
                        />
                    </label>
                    <label htmlFor="file-sender__input-84270" className="file-sender popup__file">
                        <input onInput={(e) => {
                            setCategoryData({
                                ...categoryData,
                                photo: (e.target as HTMLInputElement).files
                            });
                            setAlertMessage('');
                        }} type="file" accept="image/png, image/jpeg" id="file-sender__input-84270" className="file-sender__input" />
                        <img src={DownloadIcon} alt="Перенесите сюда ваши файлы" />
                        {categoryData.photo[0]?.name || 'Перенесите сюда файл'}
                    </label>
                    <span className="popup__alert text">{alertMessage}</span>
                    <button className="btn popup__btn" onClick={() => createCategory()}>{categoryAction === 'create' ? 'Создать' : 'Применить'}</button>
                </div>
            </Popup>
            <div className="admin__block subcategories">
                <div className="subcategories__header">
                    <div className="search subcategories__search">
                        <img src={SearchIcon} alt="поиск" className="search__icon subcategories__search-icon"/>
                        <input onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)} type="text" placeholder="Поиск" className="search__input" />
                    </div>
                    <button onClick={() => {
                        setCategoryAction('create');
                        setIsPopupOpened(true);
                    }} className="btn admin__btn">
                        <img src={PlusIcon} alt="Создать подкатегорию" />
                        Создать категорию
                    </button>
                </div>
                <ul className="list subcategories__list admin__list">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided: any) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {categories.length ? categories.map(({id, title, subcategories, photo}, i) => (
                                        <Draggable key={id} draggableId={''+id} index={i}>
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
                                                        length={subcategories.length}
                                                        countItems="подкатегорий"
                                                        photo={photo}
                                                        optionsClickHandler={() => {
                                                            setCategoryData({
                                                                id,
                                                                title,
                                                                photo: []
                                                            });
                                                            setCategoryAction('edit');
                                                            setIsPopupOpened(true);
                                                        }}
                                                        deleteItem={deleteCategory}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    )) : <Loader/>}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </ul>
                
            </div>
        </>
    );
}
 
export default Categories;