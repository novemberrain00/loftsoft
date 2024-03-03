import { FC } from "react";
import { LinkI } from "../../interfaces";

import './path.scss';
import { Link } from "react-router-dom";

interface PathPropsI {
    links: LinkI[]
}
 
const Path: FC<PathPropsI> = ({links}) => {
    return (
        <div className="path">
            {
                links.map(({text, path}, i) => {
                    const isLinkLast = i === links.length-1;
                    return (
                        <Link to={path} className={`link path__link ${isLinkLast ? 'path__link_active' : ''}`} key={i+''}>
                            {text}
                        </Link>
                    )
                })
            }
        </div>
    );
}
 
export default Path;