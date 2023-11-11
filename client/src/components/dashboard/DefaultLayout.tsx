import React , { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from './Dashboard';
import SideBar from './SideBar';
import { useSelector, useDispatch } from 'react-redux'


export default function DefaultLayout(){
    const { isAuthenticated = false } = useSelector((state: any) => state.auth);
    const { isAdmin } = useSelector((state:any)=> state.auth);

    return (
        <div className='flex flex-row w-screen flex-1'>
            <div className="flex flex-col min-h-screen flex-shrink-0">
                <div className="w-40 bg-gray-800 h-screen mr-0  top-0 left-0">
                    <SideBar />
                </div>
            </div>
            <Dashboard />
        </div>
    );
}