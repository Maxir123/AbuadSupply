import withAdminAuth from '@/lib/withAdminAuth';
import DashboardHeader from '@/components/admin/layout/DashboardHeader';
import DashboardSideBar from '@/components/admin/layout/DashboardSidebar';
import AllVendorsTable from '@/components/admin/AllVendorsTable';

const Vendors = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="hidden 800px:block">
          <DashboardSideBar active={3} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AllVendorsTable />
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(Vendors);
