import { FC, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link, useNavigate } from "react-router-dom";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import RefreshIcon from "../../../assets/images/icons/refresh.svg";
import SearchIcon from "../../../assets/images/icons/search.svg";
import DragIcon from "../../../assets/images/icons/drag-dots.svg";
import PlusIcon from "../../../assets/images/icons/plus_squared.svg"

import { ProductI, SubcategoryI } from "../../../interfaces";
import { deleteData, getData, postData } from "../../../services/services";
import AdminListItem from "../../../components/adminListItem/adminListItem";
import Loader from "../../../components/loader/loader";

import './products.scss';

interface ProductsPropsI {
    
}
 
const Products: FC<ProductsPropsI> = () => {
    const [subcategories, setSubcategories] = useState<SubcategoryI[]>([]);
    const [draggableList, setDraggableList] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const deleteProduct = async (id: number) => {
        await deleteData(`/product/${id}`)
        .then(async () => {
            await getData('/subcategories', true)
            .then((data: SubcategoryI[]) => setSubcategories(data))
        })
    }

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }

        const draggedElemIndex = result.source.index,
            replacedElemIndex = result.destination.index;

        const reorderedItems = Array.from(subcategories[draggableList].products);
        const [removed] = reorderedItems.splice(draggedElemIndex, 1);
        reorderedItems.splice(replacedElemIndex, 0, removed);

        let subcatsArrRef = subcategories;
        subcatsArrRef[draggableList] = {
            ...subcatsArrRef[draggableList],
            products: reorderedItems
        }

        setSubcategories([...subcatsArrRef])

        const prodIdList: number[] = [];
        subcategories.forEach(subcat => {
            subcat.products.forEach(item => prodIdList.push(item.id))
        })


        if(draggedElemIndex !== replacedElemIndex) {
            await postData('/product/order', prodIdList, true)
        }
    };

    useEffect(() => {
        getData('/subcategories?empty_filter=false', true)
        .then(data => setSubcategories(data));
    }, []);

    useEffect(() => console.log(searchQuery), [searchQuery]);

    return (
        <>
            <AdminHeader title="Товары">
                <button className="btn admin__btn" onClick={() => window.location.reload()}>
                    <img src={RefreshIcon} alt="Обновить" />
                    Обновить
                </button>
                <button onClick={() => navigate('add')} className="btn admin__btn">
                    <img src={PlusIcon} alt="Создать товар" />
                    Создать товар
                </button>   
            </AdminHeader>
            <div className="admin__block admin__products">
                <div className="search subcategories__search">
                    <img src={SearchIcon} alt="поиск" className="search__icon subcategories__search-icon"/>
                    <input onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value.toLocaleLowerCase())} type="text" placeholder="Поиск" className="search__input" />
                </div>
                {
                    subcategories.length ? subcategories.map(({id, products}, i) => {
                        return products.length ? ( 
                            <ul key={id} className="admin__list list subcategories__list">
                                <DragDropContext 
                                    onDragStart={() => setDraggableList(i)} 
                                    onDragEnd={onDragEnd}
                                >
                                    <Droppable droppableId="droppable">
                                        {
                                            (provided: any) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {
                                                    products.length ? products.filter(prod => prod.title.toLocaleLowerCase().includes(searchQuery))
                                                    .map(({id, title, parameters, product_photos}, i) => {
                                                        return ( 
                                                            <Draggable key={id} draggableId={''+id} index={i}>
                                                                {(provided: any) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        
                                                                    >
                                                                        <AdminListItem
                                                                            dndHandler={
                                                                                <img src={DragIcon} {...provided.dragHandleProps} alt="перетащить" className="admin__list-drag" draggable="false"/>  

                                                                            }
                                                                            id={id}
                                                                            key={id}
                                                                            title={title}
                                                                            length={parameters.length}
                                                                            countItems="параметров"
                                                                            photo={product_photos[0]?.photo}
                                                                            optionsClickHandler={() => {
                                                                                navigate(`edit/${id}`)
                                                                            }}
                                                                            deleteItem={deleteProduct}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Draggable>         
                                                        )
                                                    }) : null
                                                }
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
 
export default Products;