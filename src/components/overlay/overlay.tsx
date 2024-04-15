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

    const overlayClasses = (document.querySelector('.overlay') as HTMLElement)?.classList

    useEffect(() => {
        
        if(!overlayClasses?.contains('overlay_disappeared')) {
            (document.querySelector('html') as HTMLElement).style.overflowY = 'hidden';
        } else {
            (document.querySelector('html') as HTMLElement).style.height = 'auto';
            (document.querySelector('html') as HTMLElement).style.overflowY = 'initial'; 
        }

        return () => {
            (document.querySelector('html') as HTMLElement).style.height = 'auto';
            (document.querySelector('html') as HTMLElement).style.overflowY = 'initial';

        }
    }, [overlayClasses]);
    

    return (
        <div onClick={(e: MouseEvent) => handleClose(e)} className="overlay">
            <div className="overlay__children">
                {children}
            </div>
        </div>
    );
};

export default Overlay;