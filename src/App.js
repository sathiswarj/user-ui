import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from "./Components/index"
import User from './Pages/User';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="user-management" element={<User />} />
      </Route>
    </Routes>
  );
};

export default App;
