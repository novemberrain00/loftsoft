import { FC, useState } from "react";
import { useClipboard } from "use-clipboard-copy";

import CopyIcon from '../../assets/images/icons/copy.svg';

interface DiscountInputPropsI {
    additionalClass?: string
}
 
const DiscountInput: FC<DiscountInputPropsI> = ({additionalClass}) => {
    const [isPromoCopied, setIsPromoCopied] = useState(false);

    const clipboard = useClipboard({
        onSuccess: () => {
            setIsPromoCopied(true);
            setTimeout(() => setIsPromoCopied(false), 2000);
        }
    });

    return (
        <div onClick={clipboard.copy}className="discount__input-label">
            <input 
                type="text" 
                ref={clipboard.target} 
                value="OPENSOFT23" 
                placeholder="OPENSOFT23" 
                className={"discount__input " + additionalClass +( isPromoCopied ? ' discount__input_outlined' : '')}
                readOnly
            />
            <img src={CopyIcon} alt="скопировать" className="discount__icon"/>
        </div>
    );
}
 
export default DiscountInput;