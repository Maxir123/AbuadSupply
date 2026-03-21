import withAdminAuth from '@/lib/withAdminAuth';
import DashboardHeader from '@/components/admin/layout/DashboardHeader';
import DashboardSideBar from '@/components/admin/layout/DashboardSidebar';
import AllCouponsTable from "@/components/admin/AllCouponsTable";

const Coupons = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="w-[100px] 800px:w-[330px] bg-white  ">
          <DashboardSideBar active={9} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AllCouponsTable />
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(Coupons);