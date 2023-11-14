import Dashboard from './Dashboard';
import SideBar from './SideBar';


export default function DefaultLayout(){

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