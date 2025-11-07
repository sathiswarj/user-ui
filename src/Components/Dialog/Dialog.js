import React, { useState, useEffect } from 'react';
import { X, Plus, Filter } from 'lucide-react';

const UserDialog = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  mode = 'add',
  userData = null
}) => {
  const [userName, setUserName] = React.useState('');
  const [userCode, setUserCode] = React.useState('');
  const [countries, setCountries] = React.useState([]);

  const allCountries = ['USA', 'UK', 'Canada', 'Germany', 'Japan', 'India', 'Australia', 'France', 'Brazil', 'Mexico'];

  React.useEffect(() => {
    if (mode === 'edit' && userData) {
      setUserName(userData.name || '');
      setUserCode(userData.code || '');
      setCountries(userData.countries || []);
    } else {
      setUserName('');
      setUserCode('');
      setCountries([]);
    }
  }, [mode, userData, isOpen]);

  const handleSubmit = () => {
    if (!userName.trim()) {
      alert('User Name is required');
      return;
    }

    const formData = {
      name: userName,
      code: userCode,
      countries,
    };

    if (mode === 'edit' && userData) {
      onUpdate({ ...userData, ...formData });
    } else {
      onSave(formData);
    }

    onClose();
  };

  const handleCountryToggle = (country) => {
    setCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-[480px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'edit' ? 'Edit User' : 'Create New User'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              User Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter user name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              User Code
            </label>
            <input
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter user code (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Assign Countries ({countries.length} selected)
            </label>
            <div className="border-2 border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto bg-gray-50">
              <div className="grid grid-cols-2 gap-3">
                {allCountries.map((country) => (
                  <label
                    key={country}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-white p-3 rounded-lg transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={countries.includes(country)}
                      onChange={() => handleCountryToggle(country)}
                      className="w-5 h-5 text-blue-600 rounded-md focus:ring-2 focus:ring-blue-300 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      {country}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {mode === 'add' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                Add User
              </button>
            </div>
          )}

          {mode === 'edit' && (
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setUserName('');
                  setUserCode('');
                  setCountries([]);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={20} />
                Add User
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 font-semibold text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Update User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDialog;