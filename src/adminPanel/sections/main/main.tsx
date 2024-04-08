import { FC, useEffect, useState } from "react";

import AdminHeader from "../../../components/adminHeader/adminHeader";

import DownloadIcon from "../../../assets/images/icons/download_blue.svg";
import TrashIcon from "../../../assets/images/icons/trash_white.svg";
import DownloadWhiteIcon from "../../../assets/images/icons/download.svg";
import RefreshIcon from "../../../assets/images/icons/refresh.svg";

import { deleteData, getData, postData, uploadFile } from "../../../services/services";

import './main.scss';
import { AdminOrderI, PartnerI } from "../../../interfaces";

interface MainPropsI {
    
}
 
const Main: FC<MainPropsI> = () => {
    const [newPartners, setNewPartners] = useState<FileList>({} as FileList);
    const [partners, setPartners] = useState<PartnerI[]>([]);
    const [ordersHistory, setOrdersHitory] = useState<AdminOrderI[]>([]);

    const getPartners = async () => {
        await getData('/partners')
        .then((data: PartnerI[]) => {
            setPartners(data)
        })
    }

    const createPartner = async (photo: string) => {
        await postData('/partners', {photo}, true).then(() => getPartners())
    }

    const deletePartner = async (id: number) => {
        await deleteData(`/partner/${id}`)
        .then(() => {
            const partnersRef = partners;
            const i = partners.indexOf(partners.filter(part => part.id === id)[0]);
            partnersRef.splice(i, 1)
            setPartners([...partnersRef]);
        })
    }

    const handleImageUpload = async () => {
        const files = newPartners;

        for(let i in files) {
            if(isNaN(+i)) break

            await uploadFile(newPartners[i])
            .then(async (data: {upload: string}) => {
                await createPartner(data.upload);
            })
        }
        
    };


    useEffect(() => {
        handleImageUpload()
    }, [newPartners]);

    useEffect(() => {
        getPartners()

        getData('/orders', true)
        .then((data: AdminOrderI[]) => setOrdersHitory(data))
    }, [])

    const basicURL = process.env.REACT_APP_DEV_SERVER_URL;

    return (
        <>
            <AdminHeader title="Главная страница">
                <button className="btn admin__btn" onClick={() => window.location.reload()}>
                    <img src={RefreshIcon} alt="Обновить" />
                    Обновить
                </button>
            </AdminHeader>
            <main className="main">
                <div className="main__col">
                    <div className="admin__block main__stats">
                        <h4 className="admin__block-title main__stats-title">Количество посещений</h4>
                        <div className="main__stats-item">
                            <span className="main__stats-value">1475</span>
                            / день
                        </div>
                        <div className="main__stats-item">
                            <span className="main__stats-value">74 571</span>
                            / месяц
                        </div>
                        <div className="main__stats-item">
                            <span className="main__stats-value">1 514 714</span>
                            / год
                        </div>
                    </div>
                    <div className="main__partners admin__block admin__block_shadowless">
                        <h4 className="admin__block-title main__partners-title">Настройка партнеров</h4>
                        <div className="main__partners-items">
                            
                            {
                                partners.length ? partners.map(({photo, id}, i) => {
                                    return (
                                        <div onClick={() => deletePartner(id)} key={id} className="main__partners-item">
                                            <img key={photo} src={basicURL + '/uploads/' + photo} alt="autodesk" className="main__partners-img" />
                                            <img src={TrashIcon} alt="autodesk" className="main__partners-trash" />
                                        </div>
                                    )
                                }) : null
                            }
                        </div>
                        <label htmlFor="file-sender__input-1621w" className="file-sender main__file">
                            <input  
                                onChange={(e) => setNewPartners((e.target as HTMLInputElement).files as FileList)}
                                type="file" 
                                multiple 
                                accept="jpeg, png, svg" 
                                id="file-sender__input-1621w" 
                                className="file-sender__input" />
                                <img src={DownloadIcon} alt="Добавить партнера" 
                            />
                            {
                                'Добавить партнера' 
                            }
                        </label>
                    </div>
                </div>
                <div className="main__col">
                    <div className="admin__block main__sales">
                        <div className="main__sales-header">
                            <h4 className="admin__block-title">Количество продаж</h4>
                            <button className="btn admin__btn">
                                <img src={DownloadWhiteIcon} alt="EXCEL" />
                                EXCEL
                            </button>
                        </div>
                        <div className="main__stats main__stats_horizontal">
                            <div className="main__stats-item">
                                <span className="main__stats-value">1475</span>
                                / день
                            </div>
                            <div className="main__stats-item">
                                <span className="main__stats-value">74 571</span>
                                / месяц
                            </div>
                            <div className="main__stats-item">
                                <span className="main__stats-value">1 514 714</span>
                                / год
                            </div>
                        </div>
                        <div className="main__sales-body">
                            <h2 className="main__sales-title">Список товаров:</h2>
                            <div className="main__sales-products">
                                <ul className="list main__sales-list">
                                    <li className="main__sales-item">№</li>
                                    {
                                        ordersHistory.length ? ordersHistory.map(({number}, i) => {
                                            return (
                                                <li key={number} className="main__sales-item">{i+1}</li>

                                            )   
                                        }) : null
                                    }
                                    
                                </ul>
                                <ul className="list main__sales-list">
                                    <li className="main__sales-item">№ заказа</li>
                                    {
                                        ordersHistory.length ? ordersHistory.map(({number}, i) => {
                                            return (
                                                <li key={number} className="main__sales-item">{number}</li>

                                            )   
                                        }) : null
                                    }
                                </ul>
                                <ul className="list main__sales-list">
                                    <li className="main__sales-item">ID</li>
                                    {
                                        ordersHistory.length ? ordersHistory.map(({number, order_id}, i) => {
                                            return (
                                                <li key={number} className="main__sales-item">{order_id}</li>

                                            )   
                                        }) : null
                                    }
                                </ul>
                                <ul className="list main__sales-list">
                                    <li className="main__sales-item">E-Mail</li>
                                    {
                                        ordersHistory.length ? ordersHistory.map(({number, email}, i) => {
                                            return (
                                                <li key={number} className="main__sales-item">{email}</li>

                                            )   
                                        }) : null
                                    }
                                </ul>
                                <ul className="list main__sales-list">
                                    <li className="main__sales-item">Название товара</li>
                                    {
                                        ordersHistory.length ? ordersHistory.map(({number, product}, i) => {
                                            return (
                                                <li key={number} className="main__sales-item">{product}</li>

                                            )   
                                        }) : null
                                    }
                                </ul>
                            </div> 
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
 
export default Main;