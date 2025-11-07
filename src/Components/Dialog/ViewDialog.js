import React, {useState,useEffect} from 'react'
import { X,Edit } from 'lucide-react';
import UserDialog from './Dialog';
import { API_ENDPOINT } from '../../data/ApiEndPoint';
const ViewDialog = ({ isOpen, onClose, selectedUser, onUpdate }) => {
  const [dialogOpen, setDialogOpen] =  useState(false);
  const [dialogMode, setDialogMode] = useState('view');
  const [currentUser, setCurrentUser] =  useState(selectedUser);

  useEffect(() => {
    setCurrentUser(selectedUser);
  }, [selectedUser]);

  if (!isOpen || !currentUser) return null;

  const handleEdit = () => {
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    const updatedWithId = { ...updatedUser, id: currentUser.id };
    setCurrentUser(updatedWithId);
    if (onUpdate) onUpdate(updatedWithId);
    setDialogOpen(false);

    try {
      const response = await fetch(`${API_ENDPOINT}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update user');
      }

      await response.json();
      alert('User updated successfully!');
      onClose();
    } catch (err) {
      console.error('Error updating user:', err);
      alert(`Failed to update user: ${err.message}. Changes were made locally but not saved to server.`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <h2 className="text-xl font-semibold">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">ID</span>
              <span className="text-gray-600">{currentUser.id}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">Name</span>
              <span className="text-gray-600">{currentUser.name}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">Code</span>
              <span className="text-gray-600">{currentUser.code || 'Not assigned'}</span>
            </div>

            <div className="py-2">
              <span className="font-medium text-gray-700 block mb-2">Countries</span>
              <div className="flex flex-wrap gap-2">
                {currentUser.countries?.length > 0 ? (
                  currentUser.countries.map((country, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {country}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No countries assigned</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <UserDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUpdate={handleUpdateUser}
        mode={dialogMode}
        userData={currentUser}
      />
    </>
  );
};


export default ViewDialog