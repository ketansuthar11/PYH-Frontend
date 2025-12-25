import React from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
function AdminDashboard() {
    return (
        <div className='dashboard'>
            <Navbar />
            <div className='dashboard-actions'>
                <Link className='action-card' to="/main/plants">
                    See Plant stocks
                </Link>
                <Link className='action-card' to="/manageorders">
                    Manage Orders
                </Link>
                <Link className='action-card' to="/admin/addstock">
                    Add New Plant
                </Link>
            </div>

        </div>
    )
}

export default AdminDashboard;
