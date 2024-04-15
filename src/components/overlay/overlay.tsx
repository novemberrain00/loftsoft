import React, {FC, MouseEvent, useEffect, useState} from 'react';

import './overlay.scss';

interface OverlayI {
    children: React.ReactNode
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
}

const Overlay: FC<OverlayI> = ({children, closeHandler}) => {
    const handleClose = (e: MouseEvent) => {
        if((e.target as HTMLElement).classList.contains('overlay')) {
            (e.target as HTMLElement).classList.add('overlay_disappeared')
            setTimeout(() => closeHandler(false), 300) 
        }
    };
    

    return (
        <div onClick={(e: MouseEvent) => handleClose(e)} className="overlay">
            <div className="overlay__children">
                {children}
            </div>
        </div>
    );
};

export default Overlay;