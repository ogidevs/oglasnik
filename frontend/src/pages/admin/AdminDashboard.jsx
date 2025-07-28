import React from 'react';
import AdminUserManagement from '../../components/admin/AdminUserManagement';
import AdminCategoryManagement from '../../components/admin/AdminCategoryManagement';
import LogsTable from '../../components/admin/LogsTable';

const AdminDashboard = () => {
return (
    <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AdminUserManagement />
            <AdminCategoryManagement />
        </div>
        <div className="flex flex-col justify-center items-center mt-8">
            <LogsTable />
        </div>
    </div>
);
};

export default AdminDashboard;
