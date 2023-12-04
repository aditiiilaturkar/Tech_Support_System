import  { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useDispatch } from 'react-redux'

import { setCredentials, loginSuccess } from './actions';

import './App.css';
import DefaultLayout from './components/dashboard/DefaultLayout';
import LoginPage from './components/login/LoginPage';
import CreateTicket from './components/employee/CreateTicket';
import TicketDetails from './components/admin/TicketDetails';
import SignUpPage from './components/signUp/SignUpPage';
import ManageAccounts from './components/admin/ManageAccounts';
import DisplayAna from './components/admin/DisplayAnalytics';


function App() {
  const dispatch = useDispatch()  

  useEffect(() => {
    const storedLoginState = JSON.parse(localStorage.getItem('loginState') || '{}');
    if (storedLoginState.username) {
      dispatch(setCredentials({ username: storedLoginState.username, password: storedLoginState.password, isAdmin: storedLoginState.isAdmin,
      firstName: storedLoginState.firstName, lastName:storedLoginState.lastName }));
      dispatch(loginSuccess());
    }
  }, []);

  return (
    <div className="w-screen h-screen">
   
     <BrowserRouter>
        <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signUp" element={<SignUpPage />} />
                <Route path="/dashboardLayout" element={<DefaultLayout />} />
                <Route path="/createTicket" element={<CreateTicket />} />
                <Route path="/ticket/:ticketId" element={<TicketDetails />} />
                <Route path="/manageAccounts" element={<ManageAccounts />} />
                <Route path="/displayAnalytics" element={<DisplayAna />} />
        </Routes>
      </BrowserRouter>
    
  </div>
  );
}

export default App;
