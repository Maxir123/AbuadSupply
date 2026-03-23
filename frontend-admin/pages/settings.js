import withAdminAuth from '@/lib/withAdminAuth';
import DashboardHeader from '@/components/admin/layout/DashboardHeader';
import DashboardSideBar from '@/components/admin/layout/DashboardSidebar';
import AdminSettings from '@/components/admin/Settings/AdminSettings';

const Settings = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <DashboardHeader />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – hidden on mobile, visible from 800px upward */}
        <div className="hidden 800px:block bg-white shadow-md z-10">
          <DashboardSideBar active={14} />
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <AdminSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(Settings);