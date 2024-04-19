import { FC } from "react";

import EditIcon from "../../assets/images/icons/edit.svg";
import OptionsIcon from "../../assets/images/icons/options.svg";
import TrashIcon from "../../assets/images/icons/trash.svg";

import './adminListItem.scss';

interface AdminListItemPropsI {
    id: number
    photo: string
    title: string
    length: number
    countItems: string
    dndHandler: React.ReactNode
    optionsClickHandler: () => any
    deleteItem: (id: number) => Promise<void>
    categoryTitle?: string
}
 
const AdminListItem: FC<AdminListItemPropsI> = ({
        id, 
        photo, 
        title, 
        length, 
        countItems, 
        dndHandler, 
        categoryTitle,
        optionsClickHandler, 
        deleteItem
    }) => {

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    return (
        <div className="admin__list-item-wrapper">
            <li key={id} className="admin__list-item" draggable="true">
                <img src={baseURL + '/uploads/' + photo} alt="windows" className="admin__list-img"/>
                <div className="admin__list-info">
                    <h5 className="admin__list-info-title">
                        {title}
                        <img src={EditIcon} alt={title} />
                    </h5>
                    <div className="admin__list-info-bottom">
                        {/* {
                            categoryTitle ?
                                <div className="admin__list-category">
                                    {categoryTitle}
                                    <img src={ArrowIcon} alt={categoryTitle} />
                                </div> 
                            : null
                        } */}
                        <div className="admin__list-amount">
                            <span className="admin__list-amount-value">{length}</span>
                            <span className="admin__list-amount-key">{countItems}</span>           
                        </div>
                    </div>
                </div>
                {dndHandler}
                <div className="admin__list-helpers">
                    <button onClick={optionsClickHandler} className="admin__list-helper">
                        <img src={OptionsIcon} alt="Настроить" className="admin__list-helper-icon"/>
                    </button>
                    <button onClick={() => deleteItem(id)} className="admin__list-helper">
                        <img src={TrashIcon} alt="Удалить" className="admin__list-helper-icon"/>
                    </button>
                </div>
            </li>
        </div>
    );
}
 
export default AdminListItem;