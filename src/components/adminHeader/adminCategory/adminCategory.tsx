import { FC, useContext, useState } from "react";
import AdminListItem from "../../adminListItem/adminListItem";

import DragIcon from "../../../assets/images/icons/drag-dots.svg";
import CloseIcon from "../../../assets/images/icons/close.svg";
import UploadIcon from "../../../assets/images/icons/upload.svg";
import CheckIcon from "../../../assets/images/icons/check.svg";

import { uploadFile } from "../../../services/services";
import { CategoryI } from "../../../interfaces";

import { CategoriesContext } from "../../../context";
import './adminCategory.scss';

interface AdminCategoryPropsI {
    i: number
    id: number
    title: string
    length: number
    photo: string
    provided: any
    colors: string[]
    setCategories: React.Dispatch<React.SetStateAction<CategoryI[]>>
    deletItem: (id: number) => Promise<void>,
}
 
const AdminCategory: FC<AdminCategoryPropsI> = ({i, id, title, length, photo, provided, colors, deletItem, setCategories}) => {
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const categories = useContext(CategoriesContext);
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const [categoryData, setCategoryData] = useState({
        photo,
        title,
        colors
    });

    const updateCategory = async () => {
        setIsEditorOpened(false);

        await fetch(`${baseURL}/category/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                title: categoryData.title,
                photo: categoryData.photo,
                colors: categoryData.colors
            }),
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + window.localStorage.getItem('access_token') as string,
                "Content-Type": "application/json"
            }
        })
        .then((data) => data.json())
        .then((data: CategoryI) => {
            const categoriesRef = categories;
            categoriesRef[i] = data;
            setCategories(categoriesRef)
        })
    }

    return !isEditorOpened ? (
        <AdminListItem
            dndHandler={
                <img src={DragIcon} {...provided.dragHandleProps} alt="перетащить" className="admin__list-drag"/>  
            }
            id={id}
            key={id}
            title={title}
            length={length}
            countItems="подкатегорий"
            photo={photo}
            optionsClickHandler={() => {
                setIsEditorOpened(true)
            }}
            deleteItem={deletItem}
        />
    ) : (
        <div className="category-editor">
            <label htmlFor={`category-avatar-${i}`} className="category-editor__file">
                <img 
                    src={
                        categoryData.photo ? 
                        baseURL + '/uploads/' + categoryData.photo :
                        UploadIcon
                    } 
                    className="category-editor__file-img"
                    alt="выберите файл" 
                />
                <input 
                    onInput={async (e) => { 
                        const inputElement = e.target as HTMLInputElement;
                        
                        if (!inputElement.files || !inputElement.files[0]) return;
                    
                        await uploadFile(inputElement.files[0])
                        .then(data => setCategoryData({
                            ...categoryData,
                            photo: data.upload
                        }));
                        
                    }}
                    id={`category-avatar-${i}`} 
                    type="file" 
                    className="category-editor__file-input" 
                />
            </label>
            <div className="category-editor__option">
                <h6 className="category-editor__option-title">Название:</h6>
                <input 
                    onInput={(e) => setCategoryData({
                        ...categoryData, 
                        title: (e.target as HTMLInputElement).value
                    })} 
                    value={categoryData.title}
                    type="text" 
                    className="category-editor__option-input" 
                />
            </div>
            <div className="category-editor__option">
                <h6 className="category-editor__option-title">Цвет:</h6>
                <div className="category-editor__option-bottom">
                    <input 
                        onBlur={(e) => {
                            if(categoryData.colors.length === 2) return;
                            
                            const colorsRef = categoryData.colors as string[];
                            colorsRef.push((e.target as HTMLInputElement).value.trim().toLocaleLowerCase())

                            setCategoryData({
                                ...categoryData, 
                                colors: colorsRef as never[]
                            })


                        }} 
                        type="text" 
                        className="category-editor__option-input" 
                    />
                    {
                        categoryData.colors.map((color, i) => (
                        <span 
                            style={{backgroundColor: color}} 
                            key={color} 
                            onClick={() => {
                                const colorsRef = categoryData.colors;
                                categoryData.colors.splice(i, 1);
                                setCategoryData({
                                    ...categoryData,
                                    colors: colorsRef
                                })
                            }}
                            className="category-editor__option-color"
                        >
                        </span>
                        )
                        )
                    }
                    
                </div>
            </div>
            <button onClick={() => updateCategory()} className="btn category-editor__btn">
                Готово
                <img src={CheckIcon} alt="готово" />
            </button>
            <img src={CloseIcon} onClick={() => setIsEditorOpened(false)} alt="Закрыть" className="category-editor__closer"/>
        </div>
    );
}
 
export default AdminCategory;