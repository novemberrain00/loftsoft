import { FC, useEffect, useState } from "react";

import { useDispatch } from 'react-redux';

import { removeLastSnack } from "../../redux/snackbarSlice";
import './snack.scss';

export interface SnackPropsI {
    text: string
}
 
const Snack: FC<SnackPropsI> = ({text}) => {
    const [isSnackHidden, setIsSnackHidden] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            setIsSnackHidden(true);
            dispatch(removeLastSnack())
        }, 3600)
    }, [])


    return !isSnackHidden ? (
        <div className="snackbar__snack snack">
            {text}
            <span onClick={() => setIsSnackHidden(true)} className="snack__closer">Принято</span>
        </div>
    ): null;
}

export default Snack;