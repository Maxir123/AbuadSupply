import withAdminAuth from '@/lib/withAdminAuth';
import DashboardHeader from '@/components/admin/layout/DashboardHeader';
import DashboardSideBar from '@/components/admin/layout/DashboardSidebar';
import BankOverview from '@/components/admin/BankOverview';

const BankPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        {/* Sticky sidebar container */}
        <div className="hidden 800px:block">
          <DashboardSideBar active={13} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <BankOverview />
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(BankPage);