import withAdminAuth from '@/lib/withAdminAuth';
import DashboardHeader from '@/components/admin/layout/DashboardHeader';
import DashboardSideBar from '@/components/admin/layout/DashboardSidebar';
import AllRefundsTable from '@/components/admin/AllRefundsTable';

const Refunds = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="hidden 800px:block">
          <DashboardSideBar active={11} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AllRefundsTable />
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(Refunds);
