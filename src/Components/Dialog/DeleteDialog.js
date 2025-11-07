import React from 'react'
import { AlertCircle } from 'lucide-react';
const DeleteDialog = ({ isOpen, onClose, userToDelete, onConfirm }) => {
  if (!isOpen || !userToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-[480px]">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle size={32} className="text-red-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">Delete User?</h2>
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-bold text-gray-800">{userToDelete.name}</span>?
          <br />
          <span className="text-sm text-red-600 font-medium">This action cannot be undone.</span>
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog