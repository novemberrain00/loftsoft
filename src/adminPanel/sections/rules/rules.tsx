import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import AdminHeader from "../../../components/adminHeader/adminHeader";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Value } from 'react-quill';
import { useDispatch } from 'react-redux';

import BackArrow from "../../../assets/images/icons/arrow_left.svg";
import SaveIcon from "../../../assets/images/icons/save.svg";
import PlusIcon from "../../../assets/images/icons/plus.svg";
import { TabI } from "../../../interfaces";
import { getData, postData } from "../../../services/services";


import 'react-quill/dist/quill.snow.css';
import '../../../lib/quill/quill.scss';
import './rules.scss';
import { addSnack } from "../../../redux/snackbarSlice";

interface RulesProps {
    
}
 
const Rules: FC<RulesProps> = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabRef = useRef(null);

    const dispatch = useDispatch();

    const [tabs, setTabs] = useState<TabI[]>([])

    const modules = {
        toolbar: [
          [{ 'header': '1' }],
          ['bold', 'italic', {'list': 'ordered'}, {'list': 'bullet'}],
        ],
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
        await postData('/faq', tabs.filter(tab => tab.content && tab.title).map(tab => {
            return {
                title: tab.title,
                content: tab.content
            }
        }), true)
        .then(() => dispatch(addSnack({text: 'Данные успешно обновлены'})))
    }
    const navigate = useNavigate()

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
                            {
                                tabs.length ? tabs.map((tab, i) => {
                                    return (
                                        <input 
                                            key={tab.id}
                                            contentEditable={tab.isNew}
                                            value={tab.title}
                                            onInput={(e) => editTab(
                                                i, 
                                                (e.target as HTMLInputElement).value as string, 
                                                tab.content as string
                                            )}
                                            ref={tab.isNew ? tabRef : null}
                                            onClick={(e: MouseEvent) => {
                                                e.preventDefault()
                                                setActiveTab(i)
                                            }} 
                                            className={
                                                `
                                                link terms__category 
                                                ${tab.isNew ? 'terms__category_new' : ''}
                                                text text_small
                                                `
                                            }
                                        />
                                    ) 
                                }) : ''
                            }
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
                        value={tabs[activeTab]?.content as string} 
                        modules={modules}
                        onChange={(value, delta, source) => {
                            if(source === 'user') editTab(activeTab, tabs[activeTab]?.title, value)
                        }} 
                    />
                </div>
            </div>
        </>
    );
}
 
export default Rules;