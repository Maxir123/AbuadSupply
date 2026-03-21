// /pages/vendor/sales.js
import DashboardHeader from "@/components/vendor/layout/DashboardHeader";
import DashboardSideBar from "@/components/vendor/layout/DashboardSideBar";
import AllSaleProducts from '@/components/vendor/AllSaleProducts';
import withVendorAuth from "@/lib/withVendorAuth";

const VendorAllSaleProducts = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="hidden 800px:block">
          <DashboardSideBar active={5} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AllSaleProducts />
        </div>
      </div>
    </div>
  );
};

export default withVendorAuth(VendorAllSaleProducts);