import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import AdminHeader from "../../../components/adminHeader/adminHeader";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Value } from 'react-quill';

import BackArrow from "../../../assets/images/icons/arrow_left.svg";
import SaveIcon from "../../../assets/images/icons/save.svg";
import PlusIcon from "../../../assets/images/icons/plus.svg";
import { TabI } from "../../../interfaces";


import 'react-quill/dist/quill.snow.css';
import '../../../lib/quill/quill.scss';
import './rules.scss';

interface RulesProps {
    
}
 
const Rules: FC<RulesProps> = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabRef = useRef(null);

    const [tabs, setTabs] = useState<TabI[]>(
    [
        {
            title: 'Основные положения',
            anchor: 0,
            slug: '',
            content: ''
        }, 
        {
            title: 'Корректировки и правила',
            anchor: 1,
            slug: '',
            content: ''
        },
        {
            title: 'Условия возврата/обмена',
            anchor: 2,
            slug: '',
            content: '<b>dadwad</b>'
        },
        {
            title: 'Происхождение аккаунтов',
            anchor: 3,
            slug: '',
            content: ''
        },
        {
            title: 'Часто задаваемые вопросы',
            anchor: 4,
            slug: '',
            content: ''
        }, 
        {
            title: 'Безопасность конфиденциальности',
            anchor: 5,
            slug: '',
            content: ''
        }, 
        
    ])

    const modules = {
        toolbar: [
          [{ 'header': '1' }],
          ['bold', 'italic', {'list': 'ordered'}, {'list': 'bullet'}],
        ],
      };

        useEffect(() => {
            if (tabRef.current) {
                (tabRef.current as HTMLElement).focus();
            }
        }, [tabs]); 

    const editTab = (i: number, value: string) => {
        const tabsRef = tabs;

        tabsRef[i] = {
            ...tabsRef[i],
            content: value
        }

        console.log(tabsRef)

        setTabs([...tabsRef])
    }

    const navigate = useNavigate()

    return (
        <>
            <AdminHeader title="Редактирование правил">
                <button onClick={() => navigate(-1)} className="admin__btn btn">
                    <img src={BackArrow} alt="назад"/>
                    Назад
                </button>
                <button className="admin__btn btn">
                    <img src={SaveIcon} alt="Сохранить"/>
                    Сохранить изменения
                </button>
            </AdminHeader>
            <div className="terms admin__terms">
                <div className="terms__container">
                    <aside className="terms__sidebar block">
                        <h1 className="title terms__title">Пользовательское <br /> соглашение</h1>
                        <div className="terms__categories">
                            {
                                tabs.length && tabs.map((tab) => {
                                    return (
                                        <a 
                                            href="#" 
                                            contentEditable={tab.isNew}
                                            ref={tab.isNew ? tabRef : null}
                                            onClick={(e: MouseEvent) => {
                                                e.preventDefault()
                                                setActiveTab(tab.anchor)
                                            }} 
                                            className={
                                                `
                                                link terms__category 
                                                ${tab.isNew ? 'terms__category_new' : ''}
                                                text text_small
                                                `
                                            }
                                        >
                                            {tab.isNew ? '' : tab.title}
                                        </a>
                                    ) 
                                })
                            }
                            <button onClick={() => {
                                setTabs([
                                    ...tabs,
                                    {
                                        anchor: tabs.length,
                                        title: '',
                                        isNew: true,
                                        content: '<h1>Заголовок</h1>Текст',
                                        slug: ''
                                    }
                                ])
                            }} className="btn admin__btn">
                                <img src={PlusIcon} alt="Создать" />
                                Создать новый раздел
                            </button>
                        </div>
                    </aside>
                    {
                        tabs.length && tabs.map(({anchor, content}) => {
                            return activeTab  === anchor && 
                                <ReactQuill 
                                    theme="snow" 
                                    value={content as string} 
                                    modules={modules}
                                    onChange={(value) => editTab(anchor, value)} 
                                />
                        })
                    }
                </div>
            </div>
        </>
    );
}
 
export default Rules;