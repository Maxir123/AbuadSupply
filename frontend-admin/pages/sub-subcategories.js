import withAdminAuth from '@/lib/withAdminAuth';
import DashboardHeader from '@/components/admin/layout/DashboardHeader';
import DashboardSideBar from '@/components/admin/layout/DashboardSidebar';
import SubSubCategoryTable from "@/components/admin/SubSubcategoryTable";

const SubSubcategories = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        <div className="hidden 800px:block">
          <DashboardSideBar active={8} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <SubSubCategoryTable />
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(SubSubcategories);