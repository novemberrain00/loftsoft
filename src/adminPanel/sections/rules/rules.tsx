import { FC, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import { useDispatch } from 'react-redux';
import { TouchBackend } from 'react-dnd-touch-backend';

import AdminHeader from "../../../components/adminHeader/adminHeader";
import BackArrow from "../../../assets/images/icons/arrow_left.svg";
import SaveIcon from "../../../assets/images/icons/save.svg";
import PlusIcon from "../../../assets/images/icons/plus.svg";
import DragIcon from "../../../assets/images/icons/drag-dots.svg";

import { TabI } from "../../../interfaces";
import { getData, postData } from "../../../services/services";
import { addSnack } from "../../../redux/snackbarSlice";

import 'react-quill/dist/quill.snow.css';
import '../../../lib/quill/quill.scss';
import './rules.scss';

interface RulesProps {
    
}
 
const Rules: FC<RulesProps> = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState<TabI[]>([])

    const dispatch = useDispatch();

    const modules = {
        toolbar: [
          [{ 'header': '1' }],
          ['bold', 'italic', {'list': 'ordered'}, {'list': 'bullet'}],
        ],
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }
    
        const items = Array.from(tabs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        setTabs(items);
        await postData('/faq/order', items.map(item => item.id), true)

    };

    useEffect(() => {
        const fetchData = async () => {
            await getData('/faq')
            .then((data: TabI[]) => setTabs(data))            
        }

        fetchData()
    }, [])

    const editTab = (i: number, title: string, value: string) => {
        const tabsRef = tabs;
        console.log('edited')
        tabsRef[i] = {
            ...tabsRef[i],
            title,
            content: value
        }

        setTabs([...tabsRef])
    }

    const saveTabs = async () => {
        console.log(tabs)
        await postData('/faq', tabs.filter(tab => tab.content && tab.title).map(tab => {
            return {
                title: tab.title,
                content: tab.content
            }
        }), true)
        .then(() => dispatch(addSnack({text: 'Данные успешно обновлены'})))
    }
    const navigate = useNavigate()

    const curTab = tabs.filter(tab => tab.id === activeTab)[0];

    return (
        <>
            <AdminHeader title="Редактирование правил">
                <button onClick={() => navigate(-1)} className="admin__btn btn">
                    <img src={BackArrow} alt="назад"/>
                    Назад
                </button>
                <button onClick={() => saveTabs()} className="admin__btn btn">
                    <img src={SaveIcon} alt="Сохранить"/>
                    Сохранить изменения
                </button>
            </AdminHeader>
            <div className="terms admin__terms">
                <div className="terms__container">
                    <aside className="terms__sidebar block">
                        <div className="terms__categories">
                        <DragDropContext onDragEnd={onDragEnd} backend={TouchBackend}>
                            <Droppable droppableId="droppable">
                                {(provided: any) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {tabs.length ? tabs.map((tab, i) => (
                                            <Draggable key={tab.id} draggableId={'' + tab.id} index={i}>
                                                {(provided: any) => (
                                                    <div
                                                        className="terms__category-drag"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <input
                                                            key={tab.id}
                                                            value={tab.title}
                                                            onInput={(e) => editTab(i, (e.target as HTMLInputElement).value, tab.content)}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setActiveTab(tab?.id as number);
                                                            }}
                                                            className={`link terms__category ${tab.isNew ? 'terms__category_new' : ''}  ${activeTab === tab.id ? 'terms__category_active' : ''} text text_small`}
                                                        />
                                                        <img src={DragIcon} alt="Перетащить" className="terms__category-icon"/>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )) : null}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                            
                            <button onClick={() => {
                                setTabs([
                                    ...tabs,
                                    {
                                        title: '',
                                        isNew: true,
                                        content: '<h1>Заголовок</h1>Текст',
                                        slug: ''
                                    }
                                ])
                                setActiveTab(tabs.length)
                            }} className="btn admin__btn">
                                <img src={PlusIcon} alt="Создать" />
                                Создать новый раздел
                            </button>
                        </div>
                    </aside>
                    <ReactQuill 
                        theme="snow" 
                        value={tabs.filter(tab => tab.id === activeTab)[0]?.content as string} 
                        modules={modules}
                        onChange={(value, delta, source) => {
                            if(source === 'user') editTab(tabs.indexOf(curTab), curTab?.title, value)
                        }} 
                    />
                </div>
            </div>
        </>
    );
}
 
export default Rules;