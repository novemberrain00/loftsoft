import React, {FC, useEffect, useState} from 'react';
import {Routes, Route} from "react-router-dom";
import {useSelector} from 'react-redux';

import MainPage from '../../pages/mainPage/mainPage';
import CatalogPage from '../../pages/catalogPage/catalogPage';
import TermsPage from '../../pages/termsPage/termsPage';
import ProductPage from '../../pages/productPage/productPage';
import CartPage from '../../pages/cartPage/cartPage';
import ReviewsPage from '../../pages/reviewsPage/reviewsPage';
import AuthPage from '../../pages/authPage/authPage';
import SuccessPaymentPage from '../../pages/successPaymentPage/successPaymentPage';

import AdminPanel from '../../adminPanel/adminPanel';
import Main from '../../adminPanel/sections/main/main';
import Subcategories from '../../adminPanel/sections/subcategories/subcategories';
import Users from '../../adminPanel/sections/users/users';
import Start from '../../adminPanel/sections/start/start';
import TicketsHistory from '../../adminPanel/sections/ticketsHistory/ticketsHistory';
import EditProduct from '../../adminPanel/sections/editProduct/editProduct';
import Reviews from '../../adminPanel/sections/reviews/reviews';
import Promocodes from '../../adminPanel/sections/promocodes/promocodes';
import Categories from '../../adminPanel/sections/categories/categories';
import Products from '../../adminPanel/sections/products/products';
import PaymentPage from '../../pages/paymentPage/paymentPage';
import BillingData from '../../adminPanel/sections/billingData/billingData';
import Ticket from '../../adminPanel/sections/ticket/ticket';
import NotFoundPage from '../../pages/404/notFoundPage';

const Router: FC = () => {
    return (
        <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/reviews' element={<ReviewsPage/>}/>
            <Route path='/auth' element={<AuthPage/>}/>

            <Route path='/terms' element={<TermsPage tab={0}/>}/>
            <Route path='/terms/korrektirovki-i-pravila' element={<TermsPage tab={1}/>}/>
            <Route path='/terms/uslovija-vozvrata-obmena' element={<TermsPage tab={2}/>}/>
            <Route path='/terms/proishozdenie-akkauntov' element={<TermsPage tab={3}/>}/>
            <Route path='/terms/casto-zadavaemye-voprosy' element={<TermsPage tab={4}/>}/>
            <Route path='/terms/bezopasnost-konfidencialnosti' element={<TermsPage tab={5}/>}/>
            
            <Route path='/profile/cart' element={<CartPage/>}/>
            <Route path='/profile/cart/order/:id' element={<PaymentPage/>}/>
            <Route path='/profile/cart/order/:id/success' element={<SuccessPaymentPage/>}/>

            <Route path='/profile/replenish' element={<PaymentPage/>}/>

            <Route path='/catalog' element={<CatalogPage/>}/>
            <Route path='/catalog/:subcategory' element={<CatalogPage/>}/>
            <Route path='/catalog/:subcategory/:product' element={<ProductPage/>}/>
            
            <Route path='/admin' element={<AdminPanel children={<Main/>}/>}/>
            <Route path='/admin/categories' element={<AdminPanel children={<Categories/>}/>}/>
            <Route path='/admin/subcategories' element={<AdminPanel children={<Subcategories/>}/>}/>
            <Route path='/admin/users' element={<AdminPanel children={<Users/>}/>}/>
            <Route path='/admin/products/edit/:id' element={<AdminPanel children={<EditProduct title="Редактировать товар"/>}/>}/>
            <Route path='/admin/products/add' element={<AdminPanel children={<EditProduct title="Добавить товар"/>}/>}/>
            <Route path='/admin/reviews' element={<AdminPanel children={<Reviews/>}/>}/>
            <Route path='/admin/promocodes' element={<AdminPanel children={<Promocodes/>}/>}/>
            <Route path='/admin/products' element={<AdminPanel children={<Products/>}/>}/>            
            <Route path='/admin/billing' element={<AdminPanel children={<BillingData/>}/>}/>            
            
            <Route path='/admin/tickets' element={<AdminPanel children={<Start/>}/>}/>
            <Route path='/admin/tickets/history' element={<AdminPanel children={<TicketsHistory/>}/>}/>
            <Route path='/admin/tickets/:id' element={<AdminPanel children={<Ticket/>}/>}/>
            <Route path='/admin/tickets/history/:id' element={<AdminPanel children={<Ticket/>}/>}/>
           

            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    )
};
export default Router;