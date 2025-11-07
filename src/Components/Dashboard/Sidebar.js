import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="p-4 bg-gray-100 h-screen w-60 border-r-4 border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Admin panel</h2>
      <ul className="space-y-2">
         
        <li>
          <Link to="/user-management" className="block hover:text-blue-600">
            Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
