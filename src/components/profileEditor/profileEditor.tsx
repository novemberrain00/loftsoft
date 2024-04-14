import { FC, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '../../assets/images/icons/close.svg';
import DownloadIcon from '../../assets/images/icons/download_blue.svg';

import { updateCurrentUser, uploadFile } from "../../services/services";

import { setUserInfo } from "../../redux/userSlice";
import { RootState } from "../../store";

import './profileEditor.scss';

interface ProfileEditorPropsI {
    editingData: string
    closeHandler: React.Dispatch<React.SetStateAction<boolean>>
    isOpened: boolean
}

interface UpdatedDataI {
    username: string
    photo: any
}
 
const ProfileEditor: FC<ProfileEditorPropsI> = ({editingData, closeHandler, isOpened}) => {
    const dispatch = useDispatch();
    const userData =  useSelector((state: RootState) => state.user.userInfo);
    const baseURL = process.env.REACT_APP_DEV_SERVER_URL;

    const [updatedData, setUpdatedData] = useState<UpdatedDataI>({
        username: userData.username,
        photo: []
    });
    const [shouldEditorDisappear, setShouldEditorDisappear] = useState(false);

    const closeEditor = () => {
        setShouldEditorDisappear(true);
        setTimeout(() => {
            closeHandler(false);
        }, 600)
    }

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        closeEditor();

        const updatedImg = await uploadFile(updatedData.photo[0]).then((res) => res.upload);
        const updatePayload = updatedData.username === userData.username ?
        {
            photo: updatedImg || userData.photo.substring(userData.photo.lastIndexOf("/")+1)
        } :
        {
            username: updatedData.username,
            photo: updatedImg || userData.photo.substring(userData.photo.lastIndexOf("/")+1)
        }

        

        await updateCurrentUser(updatePayload)
        .then(res => {
            dispatch(setUserInfo({
                ...userData,
                username: res.username,
                photo: baseURL + '/uploads/' + res.photo
            }))
        });
    }

    const handleClickOutside = (event: MouseEvent) => {
        const editorElement = document.querySelector('.edior');
        const headerProfileElement = document.querySelector('.header__profile');

        if (
            editorElement && 
            headerProfileElement && 
            
            !editorElement.contains(event.target as Node) && 
            !headerProfileElement.contains(event.target as Node) &&
            
            event.target !== headerProfileElement
        ) {
            closeEditor()
        }
    };
    
    const handleScroll = () => closeEditor()

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('scroll', () => handleScroll);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return isOpened ? (
        <div className={`editor ${shouldEditorDisappear ? 'editor_disappeared' : ''}`}>
            <div className="editor__header">
                <h2 className="title editor__title">Персонализация</h2>
                <img src={CloseIcon} onClick={() => closeEditor()} alt="Персонализация" className="editor__closer" />
            </div>
            <form onSubmit={(e: FormEvent) => submitHandler(e)} action="post" className="editor__form">
                <div className="editor__avatar">
                    <img src={userData.photo} alt={userData.username} className="editor__avatar-img" />
                    <label htmlFor="file-sender__input-84270" className="file-sender editor__avatar-file">
                        <input onInput={(e) => {
                            setUpdatedData({
                                ...updatedData,
                                photo:(e.target as HTMLInputElement).files
                            })
                        }} type="file" accept="image/png, image/jpeg" id="file-sender__input-84270" className="file-sender__input" />
                        <img src={DownloadIcon} alt="Перенесите сюда ваши файлы" />
                        {
                           updatedData.photo[0]?.name || 'Перенесите сюда ваши файлы' 
                        }
                    </label>
                </div>
                <div className="editor__login">
                    <label htmlFor="editor__login-input" className="editor__login-label">
                        <input onInput={(e) => setUpdatedData({
                            ...updatedData,
                            username: (e.target as HTMLInputElement).value
                        })} value={updatedData.username} type="text" id="editor__login-input" className="editor__login-input" />
                    </label>
                </div>
                <input type="submit" value="Сохранить" className="editor__saver"/>
            </form>
        </div>
    ): null;
}
 
export default ProfileEditor;