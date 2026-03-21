import DashboardHeader from "@/components/vendor/layout/DashboardHeader";
import DashboardSideBar from "@/components/vendor/layout/DashboardSideBar";
import CreateFlashSale from "@/components/vendor/CreateFlashSale";
import withVendorAuth from "@/lib/withVendorAuth";

const VendorCreateFlashSale = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        {/* Sidebar - hidden on mobile, visible on 800px and above */}
        <div className="hidden 800px:block">
          <DashboardSideBar active={6} />
        </div>

        {/* Main content - takes full width when sidebar hidden */}
        <div className="flex-1 overflow-y-auto">
          <CreateFlashSale />
        </div>
      </div>
    </div>
  );
};

export default withVendorAuth(VendorCreateFlashSale);