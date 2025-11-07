import React, { useEffect, useState } from 'react';
import Table from '../Components/Table';
 import { API_ENDPOINT } from '../data/ApiEndPoint';
const User = () => {
  return (
    <>
      <div className="p-2"> 
        <Table />
      </div>
    </>
  );
};

export default User;
