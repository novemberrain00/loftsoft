import { FC } from "react";

interface TabsProps {
    links: React.ReactNode[]
    additionalClassForLink: string
    classList: string
    sections: React.ReactNode[]
}
 
const Tabs: FC<TabsProps> = ({links, additionalClassForLink, classList, sections}) => {
    return (
        <div className="tabs">
            <div className="tabs__links">
                {
                    links.map((link, i) => {
                        return <span className={`tabs__link ${additionalClassForLink}`} key={'' + i}>{link}</span>
                    })
                }
            </div>
            <div className={`tabs__sections ${classList}`}>
                {
                    sections.map((section, i) => {
                        return <div className="tabs__section" key={i + ''}>{section}</div>
                    })
                }
            </div>
        </div>
    );
}
 
export default Tabs;