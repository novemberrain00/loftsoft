import { FC, MouseEvent, useEffect, useState } from "react";
import RootPage from "../rootPage/rootPage";

import { TabI } from "../../interfaces";
import { getData } from "../../services/services";
import { useNavigate } from "react-router-dom";
import './termsPage.scss';

interface TermsPagePropsI {
}
 
const TermsPage: FC<TermsPagePropsI> = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState<TabI[]>([]);

    const navigate = useNavigate()

    const url = window.location.pathname;

    //useEffect(() => setActiveTab(tab || 0), [tab]);

    useEffect(() => {
        const fetchData = async () => {
            await getData('/faq')
            .then((data: TabI[]) => setTabs(data))
        }

        fetchData()
    }, [])

    document.title = "Пользовательское сошлашение"
    
    return (
        <RootPage>
            <main className="terms">
                <div className="terms__container container">
                    <aside className="terms__sidebar block">
                        <h1 className="title terms__title">Пользовательское <br /> соглашение</h1>
                        <div className="terms__categories">
                            {
                                tabs.length && tabs.map((tab) => {
                                    return (
                                    <a 
                                        href='#'
                                        key={tab.slug}
                                        onClick={(e: MouseEvent) => {
                                            e.preventDefault()
                                            setActiveTab(tab.id || 0)
                                            navigate(`/terms/${tab.slug}`)
                                        }} 
                                        className={`link terms__category ${activeTab === tab.id ? 'terms__category_active' : ''} text text_small`}
                                    >
                                        {tab.title}
                                    </a>
                                    )
                                })
                            }
                        </div>
                    </aside>
                    {
                        tabs.length && tabs.map(({id, content, slug}) => {
                            return url === `/terms/${slug}` ?
                                 <div className="terms__section block" dangerouslySetInnerHTML={{ __html: content }} /> : ''
                        })
                    }
                </div>
            </main>
        </RootPage>
    );
}
 
export default TermsPage;