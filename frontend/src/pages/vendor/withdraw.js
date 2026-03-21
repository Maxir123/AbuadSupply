import DashboardHeader from "@/components/vendor/layout/DashboardHeader";
import DashboardSideBar from "@/components/vendor/layout/DashboardSideBar";
import VendorWithdraw from "@/components/vendor/VendorWithdraw";

const VendorWithdrawPage = () => {
  return (
    <div>
      <DashboardHeader />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DashboardSideBar active={7} />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full px-2 sm:px-4 md:px-6">
          <VendorWithdraw />
        </div>
      </div>
    </div>
  );
};

export default VendorWithdrawPage;