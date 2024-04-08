import { FC } from "react";

import './snackbar.scss';;

interface SnackbarPropsI {
    children: React.ReactNode
}
 
const Snackbar: FC<SnackbarPropsI> = ({children}) => {
    return (
        <div className="snackbar">
            {children}
        </div>
    );
}
 
export default Snackbar;