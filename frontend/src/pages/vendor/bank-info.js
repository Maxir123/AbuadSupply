import DashboardHeader from "@/components/vendor/layout/DashboardHeader";
import DashboardSideBar from "@/components/vendor/layout/DashboardSideBar";
import VendorBankInfo from "@/components/vendor/VendorBankInfo";

const BankInfoPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="w-full flex min-h-screen">
        {/* Sidebar - hidden on mobile, visible on tablet and above */}
        <div className="hidden 800px:block">
          <DashboardSideBar active={8} />
        </div>

        {/* Main content - takes full width when sidebar hidden, else remaining width */}
        <div className="flex-1 w-full flex justify-center">
          <VendorBankInfo />
        </div>
      </div>
    </div>
  );
};

export default BankInfoPage;