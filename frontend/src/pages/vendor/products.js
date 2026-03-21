import DashboardHeader from "@/components/vendor/layout/DashboardHeader";
import DashboardSideBar from "@/components/vendor/layout/DashboardSideBar";
import AllProducts from '@/components/vendor/AllProducts';
import withVendorAuth from "@/lib/withVendorAuth";

const VendorProducts = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        {/* Sidebar - hidden on mobile, visible on 800px and above */}
        <div className="hidden 800px:block">
          <DashboardSideBar active={3} />
        </div>

        {/* Main content - takes full width when sidebar hidden */}
        <div className="flex-1 overflow-y-auto">
          <AllProducts />
        </div>
      </div>
    </div>
  );
};

export default withVendorAuth(VendorProducts);