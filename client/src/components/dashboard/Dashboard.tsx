
import React , { Suspense, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Ticket } from '../admin/Ticket';
import SideBar from './SideBar';

interface TicketData {
  id: number;
  name: string;
  dept: string;
  priority: string;
  time: string;
  status: string;
}

const tempTickets = [
    {
        id: 1,
        name: "admin@gmail.com",
        dept: "abc",
        priority: "high",
        time: "10/20/23" ,
        status: "open"
    },
    {
        id: 2,
        name: "ABC2",
        dept: "abc",
        priority: "low",
        time: "10/20/23" ,
        status: "open"
    },
    {
        id: 3,
        name: "admin@gmail.com",
        dept: "abc",
        priority: "high",
        time: "10/20/23" ,
        status: "closed"
    },
    {
        id: 4,
        name: "ABC3",
        dept: "abc",
        priority: "low",
        time: "10/20/23" ,
        status: "closed"
    },
    {
        id: 4,
        name: "admin@gmail.com",
        dept: "abc",
        priority: "high",
        time: "10/20/23" ,
        status: "closed"
    },
    {
        id: 5,
        name: "ABC3",
        dept: "abc",
        priority: "medium",
        time: "10/20/23" ,
        status: "closed"
    },
    {
        id: 6,
        name: "ABC4",
        dept: "abc",
        priority: "high",
        time: "10/20/23" ,
        status: "closed"
    }

]

const popupMessage = "Do you want to resolve this ticket?";

export default function Dashboard() {
  const [tickets, setTickets] = useState<TicketData[]>([...tempTickets]);
  const [showPopup, setShowPopup] = useState(false);
  const [resolveTicketId, setResolveTicketId] = useState<number | null>(null);

  const { isAuthenticated = false } = useSelector((state: any) => state.auth);
  const { isAdmin } = useSelector((state:any)=> state.auth);
  const { username, password } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();



  const handleClick = (id: number) => {
    setShowPopup(true);
    setResolveTicketId(id);
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  }

  const handleResolve = () => {
    // console.log("\n hi resolve me ", resolveTicketId);
    // TODO: Perform resolve API call here
    // After successful resolve, update ticket status and close the popup
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === resolveTicketId) {
        return { ...ticket, status: "resolved" };
      }
      return ticket;
    });
    setTickets(updatedTickets);
    setShowPopup(false);
  }

  const resolvedTicket = tickets.find(ticket => ticket.id === resolveTicketId);
  const handleCreateTicket = () => {
      navigate('/createTicket');
  }

  if(isAdmin) {
    return (
      <div className="overflow-y-auto h-screen w-full max-w-screen mt-4">
        <div>
          {tickets.map(ticket => (
            <Ticket
              key={ticket.id}
              id={ticket.id}
              name={ticket.name}
              dept={ticket.dept}
              time={ticket.time}
              status={ticket.status}
              priority={ticket.priority}
              handleClick={handleClick}
              isAdmin={isAdmin}
            />
          ))}
        </div>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ">
            <div className="bg-white p-8 rounded shadow-lg w-1/2 order-gray-300">
              {resolvedTicket && (
                <div className="mt-4">
                  <h2 className="text-lg font-bold mb-2">Resolved Ticket Details</h2>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Ticket ID:</td>
                        <td className="py-1 text-xl">{resolvedTicket.id}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Name:</td>
                        <td className="py-1 text-xl">{resolvedTicket.name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Department:</td>
                        <td className="py-1 text-xl">{resolvedTicket.dept}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Priority:</td>
                        <td className="py-1 text-xl">{resolvedTicket.priority}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Time:</td>
                        <td className="py-1 text-xl">{resolvedTicket.time}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Status:</td>
                        <td className="py-1 text-xl">{resolvedTicket.status}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {/* <p className="mb-4 text-xl">{popupMessage}</p> */}
              <div className="mt-auto flex flex-col items-end">
                <div className="flex justify-end">
                  <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded-full hover:bg-red-600 transition-colors" onClick={handleClosePopup}>Cancel</button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors" onClick={handleResolve}>Resolve</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );  
  }else{
    // console.log("\n im in else", tempTickets, username);
    return (
      <div className="p-4 relative"> 

        <button onClick={handleCreateTicket}  className="absolute top-5 right-12 mb-30 bg-blue-500 text-white px-4 py-2 rounded">
          Create Ticket
        </button>
        <h1 className="text-2xl font-bold mb-4  text-center ">Your Tickets</h1>
        {tempTickets.map(ticket => {
          if (ticket.name === username) {
            console.log("\n at least i reach here --- ", ticket.name);
            return (
              <div key={ticket.id} className="mb-4">
                <Ticket
                  id={ticket.id}
                  name={ticket.name}
                  dept={ticket.dept}
                  time={ticket.time}
                  status={ticket.status}
                  priority={ticket.priority}
                  handleClick={() => {}}
                  isAdmin={isAdmin}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
        
  }
}
