import React from "react";
import DashboardHeader from "@/components/admin/layout/DashboardHeader";
import DashboardSideBar from "@/components/admin/layout/DashboardSidebar";
import withAdminAuth from "@/lib/withAdminAuth";

const AdminInboxPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        {/* Sidebar */}
       <div className="hidden 800px:block">
          <DashboardSideBar active={12} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">Inbox</h1>

          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600">
              This is a placeholder inbox for admin messages or support tickets.
              You can integrate message threads, contact forms, or real-time chat features here.
            </p>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-700">No new messages</h3>
              <p className="text-sm text-gray-500">You currently have no new messages.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminInboxPage);
