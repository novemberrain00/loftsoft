import React, {FC} from 'react';

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
            closeHandler(false);
        }
    };

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    return (
        <div onClick={(e: any) => handleClose(e)} className="overlay">
            <div className="overlay__children">
                {children}
            </div>
        </div>
    );
};

export default Overlay;