import React, { useState, useEffect } from 'react';
import { Eye, Pen, Trash2, Plus, Funnel } from 'lucide-react';
import UserDialog from '../Dialog/Dialog';
import ViewDialog from '../Dialog/ViewDialog';
import DeleteDialog from '../Dialog/DeleteDialog';
import { API_ENDPOINT } from '../../data/ApiEndPoint';

const Table = () => {
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINT}/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setError("");
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
    setCurrentPage(1);
  }, [users]);

  const handleFilter = (e) => {
    e.preventDefault();

    const filtered = users.filter((user) => {
      const matchesName = user.name
        ?.toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesCode = user.code
        ?.toLowerCase()
        .includes(codeFilter.toLowerCase());
      const matchesCountry = user.countries?.some((country) =>
        country.toLowerCase().includes(countryFilter.toLowerCase())
      );

      return matchesName && matchesCode && matchesCountry;
    });

    setFilteredUsers(filtered);
  };

  const handleReset = () => {
    setNameFilter('');
    setCodeFilter('');
    setCountryFilter('');
    setFilteredUsers(users);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`${API_ENDPOINT}/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userToDelete.id));
      alert('User deleted successfully!');
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user: ${err.message}`);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSaveUser = async (newUser) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save user');
      }

      const savedUser = await response.json();
      setUsers([...users, savedUser]);
      alert('User added successfully!');
    } catch (err) {
      console.error('Error saving user:', err);
      alert(`Failed to save user: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br rounded border border-gray-100">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br rounded border border-red-200">
        <div className="text-center py-16">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 text-lg mb-4">Error loading users</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="p-8 bg-gradient-to-br rounded border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black">
            User Management
          </h2>
        </div>
        <div className="text-center py-16">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Eye size={32} className="text-gray-400" />
            </div>

            <p className="text-gray-500 text-lg mb-6">No users found. Create your first user!</p>

            <button
              onClick={() => {
                setDialogMode('add');
                setSelectedUser(null);
                setDialogOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              Add User
            </button>
          </div>
        </div>

        <UserDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveUser}
          mode={dialogMode}
          userData={selectedUser}
        />
      </div>
    );
  }

  return (
    <>
      <div className="p-8 bg-gradient-to-br from-white to-gray-50 rounded shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-black">
              User Management
            </h2>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <button
              onClick={() => {
                setDialogMode('add');
                setSelectedUser(null);
                setDialogOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              Add User
            </button>
          </div>
        </div>
        <div>
          <form onSubmit={handleFilter} className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Filter by Name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Filter by Code"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Filter by Country"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Funnel />
            </button>
            <button type="button" className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" onClick={handleReset}>
              Reset
            </button>
          </form>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">ID</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">User Name</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">User Code</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">Countries</th>
                <th className="text-left py-4 px-6 font-bold text-gray-700 uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm text-gray-700">
                      {user.id}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800">{user.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{user.code || '-'}</span>
                  </td>
                  <td className="py-4 px-6">
                    {Array.isArray(user.countries) && user.countries.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.countries.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                          >
                            {item}
                          </span>
                        ))}
                        {user.countries.length > 3 && (
                          <span className="inline-flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                            +{user.countries.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">No countries</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(user)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors group"
                        title="View"
                      >
                        <Eye size={18} className="group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors group"
                        title="Delete"
                      >
                        <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className='flex items-center justify-between mt-6'>
            <div className='text-sm text-gray-600'>
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
            </div>
            <div className='flex gap-2'>
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;

                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber} className="px-2">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <UserDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveUser}
        mode={dialogMode}
        userData={selectedUser}
      />

      <ViewDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        selectedUser={selectedUser}
      />

      <DeleteDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        userToDelete={userToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default Table;