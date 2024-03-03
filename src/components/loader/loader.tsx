import { FC } from "react";

import './loader.scss';

interface LoaderPropsI {
    additionalClass?: string
}
 
const Loader: FC<LoaderPropsI> = ({additionalClass}) => {
    return <span className={`loader ${additionalClass}`}></span>;
}
 
export default Loader;