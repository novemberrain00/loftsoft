import { FC, Fragment, useState } from "react";

import WindowsImg from "../../assets/images/img/catalog/windows.png";

interface PurchaseItemPropsI {
    id: number
    title: string
    items: string[]
    give_type: string

}
 
const PurchaseItem: FC<PurchaseItemPropsI> = ({ id, items, title, give_type }) => {
    const [isKeyShowed, setIsKeyShowed] = useState(false);

    const baseURL = process.env.REACT_APP_DEV_SERVER_URL


    return (  
        <li className="success__products-item">
            <img src={WindowsImg} alt="Лицензионный ключ Windows 10 Professional" className="success__products-img" />
            <h6 className="success__products-name title">
                {
                    !isKeyShowed ? `Лицензионный ключ ${title}` : items.map(item => {
                        return (
                            <Fragment key={item}>
                                {item} <br />
                            </Fragment>
                        )
                    })
                }
            </h6>
            <span className="desktop-flex success__products-char">
                {items.length || 1} шт.
            </span>
            {
                give_type === 'string' &&  
                (<span onClick={() => setIsKeyShowed(!isKeyShowed)} className="success__products-char success__products-char_rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="17" viewBox="0 0 25 17" fill="none">
                        <path d="M24.1514 8.18359C24.1172 8.10645 23.29 6.27148 21.4512 4.43262C19.001 1.98242 15.9062 0.6875 12.5 0.6875C9.09374 0.6875 5.99901 1.98242 3.54882 4.43262C1.70995 6.27148 0.878897 8.10938 0.848623 8.18359C0.804203 8.28351 0.78125 8.39163 0.78125 8.50098C0.78125 8.61032 0.804203 8.71844 0.848623 8.81836C0.882803 8.89551 1.70995 10.7295 3.54882 12.5684C5.99901 15.0176 9.09374 16.3125 12.5 16.3125C15.9062 16.3125 19.001 15.0176 21.4512 12.5684C23.29 10.7295 24.1172 8.89551 24.1514 8.81836C24.1958 8.71844 24.2187 8.61032 24.2187 8.50098C24.2187 8.39163 24.1958 8.28351 24.1514 8.18359ZM12.5 14.75C9.49413 14.75 6.86815 13.6572 4.69433 11.5029C3.80238 10.6159 3.04353 9.60445 2.4414 8.5C3.04337 7.39545 3.80223 6.38396 4.69433 5.49707C6.86815 3.34277 9.49413 2.25 12.5 2.25C15.5059 2.25 18.1318 3.34277 20.3057 5.49707C21.1993 6.38375 21.9598 7.39523 22.5635 8.5C21.8594 9.81445 18.792 14.75 12.5 14.75ZM12.5 3.8125C11.5729 3.8125 10.6666 4.08742 9.89576 4.60249C9.1249 5.11756 8.52409 5.84964 8.16931 6.70617C7.81452 7.5627 7.72169 8.5052 7.90256 9.41449C8.08343 10.3238 8.52987 11.159 9.18543 11.8146C9.84099 12.4701 10.6762 12.9166 11.5855 13.0974C12.4948 13.2783 13.4373 13.1855 14.2938 12.8307C15.1503 12.4759 15.8824 11.8751 16.3975 11.1042C16.9126 10.3334 17.1875 9.4271 17.1875 8.5C17.1862 7.25719 16.6919 6.06566 15.8131 5.18686C14.9343 4.30807 13.7428 3.81379 12.5 3.8125ZM12.5 11.625C11.8819 11.625 11.2777 11.4417 10.7638 11.0983C10.2499 10.755 9.84939 10.2669 9.61287 9.69589C9.37634 9.12487 9.31446 8.49653 9.43504 7.89034C9.55562 7.28415 9.85324 6.72733 10.2903 6.29029C10.7273 5.85325 11.2841 5.55562 11.8903 5.43505C12.4965 5.31447 13.1249 5.37635 13.6959 5.61288C14.2669 5.8494 14.755 6.24994 15.0983 6.76384C15.4417 7.27775 15.625 7.88193 15.625 8.5C15.625 9.3288 15.2958 10.1237 14.7097 10.7097C14.1236 11.2958 13.3288 11.625 12.5 11.625Z" fill={isKeyShowed ? '#2767FE' : '#000000'}/>
                    </svg>
                </span>)
            }
            {
                give_type === 'file' &&  
                (
                    items.map(item => {
                        return (
                            <a href={baseURL + '/uploads/' + item} download className="success__products-char success__products-char_rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V15H6V18H18V15H20V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z" fill="#000000"/>
                                </svg>
                            </a>
                        ) 
                    })
                
                )
            }
        </li>
    );
}
 
export default PurchaseItem;