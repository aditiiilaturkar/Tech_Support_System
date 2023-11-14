import React , { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom';

import { setCredentials, loginSuccess } from './actions';

import './App.css';
import Dashboard from './components/dashboard/Dashboard';
import DefaultLayout from './components/dashboard/DefaultLayout';
import LoginPage from './components/login/LoginPage';
import routes from './routes';
import CreateTicket from './components/employee/CreateTicket';
import TicketDetails from './components/admin/TicketDetails';


function App() {
  const dispatch = useDispatch()  

  useEffect(() => {
    const storedLoginState = JSON.parse(localStorage.getItem('loginState') || '{}');
    console.log("\n hello ji --- ", storedLoginState);
    if (storedLoginState.username && storedLoginState.password) {
      dispatch(setCredentials({ username: storedLoginState.username, password: storedLoginState.password, isAdmin: storedLoginState.isAdmin,
      firstName: storedLoginState.firstName, lastName:storedLoginState.lastName }));
      dispatch(loginSuccess());
      // navigate('/dashboardLayout');  
    }
  }, []);

  return (
    <div className="w-screen h-screen">
   
     <BrowserRouter>
        <Routes>
            {/* <Route element={<DefaultLayout />}>
            <Route index element={<Dashboard />} />
            </Route> */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboardLayout" element={<DefaultLayout />} />
                <Route path="/createTicket" element={<CreateTicket />} />
                <Route path="/ticket/:ticketId" element={<TicketDetails />} />
        </Routes>
      </BrowserRouter>
    
  </div>
  );
}

export default App;
