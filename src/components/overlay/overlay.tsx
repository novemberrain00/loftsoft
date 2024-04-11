import React, {FC, MouseEvent, useEffect} from 'react';

import './overlay.scss';

interface OverlayI {
    children: React.ReactNode
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
}

const Overlay: FC<OverlayI> = ({children, closeHandler}) => {
    const handleClose = (e: MouseEvent) => {
        if((e.target as HTMLElement).classList.contains('overlay')) {
            document.body.style.overflow = 'initial';
            document.body.style.height = 'auto';
            document.body.style.position = '';
            document.body.style.top = '';

            (e.target as HTMLElement).classList.add('overlay_disappeared')
            setTimeout(() => closeHandler(false), 300) 
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
    }, [])
    

    return (
        <div onClick={(e: MouseEvent) => handleClose(e)} className="overlay">
            <div className="overlay__children">
                {children}
            </div>
        </div>
    );
};

export default Overlay;