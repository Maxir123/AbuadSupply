// pages/orders.js
import React from 'react';
import OrderDetails from '@/components/user/OrderDetails';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const SingleOrderPage = () => {
  return (
    <div>
        <Header />
        <div className="container mx-auto px-4">
            <OrderDetails />
        </div>
        <Footer />
    </div>
  );
};



export default SingleOrderPage;
