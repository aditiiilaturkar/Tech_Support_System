
import React , { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Ticket } from '../admin/Ticket';
import { setAllTickets } from '../../actions';
import SideBar from './SideBar';
import { all } from 'axios';

interface TicketData {
  id: number;
  name: string;
  department: string;
  priority: string;
  created_on: string;
  status: string;
  description:string;
  assign_to: string;
}


const popupMessage = "Do you want to resolve this ticket?";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [resolveTicketId, setResolveTicketId] = useState<number | null>(null);

  const { isAdmin } = useSelector((state:any)=> state.auth);
  const { username } = useSelector((state: any) => state.auth);

  const { alltickets } = useSelector((state: any) => state.tickets);

  console.log("\n username -- ", username);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleClick = (id: number) => {
    setShowPopup(true);
    setResolveTicketId(id);
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  }
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:8080/get_tickets');
        const data = await response.json();

        const formattedTickets = data.map((ticket: any) => ({
          id: ticket.id,
          name: ticket.created_by,
          department: ticket.department,
          priority: ticket.priority,
          created_on: ticket.created_on,
          description: ticket.description,
          status: ticket.is_resolved ? 'resolved' : 'open',
          assign_to: ticket.assign_to,
          image: ticket.image_data ? createImageUrl(ticket.image_data) : null,
        }));

        dispatch(setAllTickets(formattedTickets));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [dispatch, loading]);

  const createImageUrl = (imageData: any) => {
    const blob = new Blob([imageData], { type: 'image/png' }); // Adjust the type based on your image format
    return URL.createObjectURL(blob);
  };
  const handleResolve = async () => {
    try {
      const response = await fetch(`http://localhost:8080/resolve_ticket/${resolveTicketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: resolveTicketId
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // console.log('Ticket resolved successfully!');
        const updatedTickets = alltickets.map((ticket: TicketData) => {
          if (ticket.id === resolveTicketId) {
            return { ...ticket, status: 'resolved' };
          }
          return ticket;
        });
        dispatch(setAllTickets(updatedTickets));
        setShowPopup(false);
      } else {
        console.error('Failed to resolve ticket:', data.message);
      }
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };
  
  const resolvedTicket = alltickets.find((ticket: TicketData) => ticket.id === resolveTicketId);
  console.log("\n resolvedTicket -- ", resolvedTicket);
  const handleCreateTicket = () => {

      navigate('/createTicket');
  }


  if(isAdmin) {
    return (
      <div className="overflow-y-auto h-screen w-full max-w-screen mt-4">
        
        <div>
          {alltickets.map((ticket: TicketData) => {
              if(ticket.assign_to === username) {
              return (
                <Ticket
                key={ticket.id}
                id={ticket.id}
                name={ticket.name}
                department={ticket.department}
                description={ticket.description}
                created_on={ticket.created_on}
                status={ticket.status}
                priority={ticket.priority}
                handleClick={handleClick}
                isAdmin={isAdmin}
              />
  
              )
  
            }
          })}
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
                        <td className="py-1 text-xl">{resolvedTicket.department}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Priority:</td>
                        <td className="py-1 text-xl">{resolvedTicket.priority}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Time:</td>
                        <td className="py-1 text-xl">{resolvedTicket.created_on}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-1 text-xl">Status:</td>
                        <td className="py-1 text-xl">{resolvedTicket.status} {resolvedTicket.assign_to}</td>
                      </tr>
                    </tbody>
                  </table>
                      {resolvedTicket.image && (
                            <img
                            src={`data:image/png;base64,${resolvedTicket.image}`}
                            alt={`Ticket ${resolvedTicket.id} Image`}
                          />
                          )}
                </div>
                  )}
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

    return (
      <div className="overflow-y-auto h-screen w-full max-w-screen mt-4"> 

        <button onClick={handleCreateTicket}  className="absolute top-5 right-12 mb-30 bg-blue-500 text-white px-4 py-2 rounded">
          Create Ticket
        </button>
        <h1 className="text-2xl font-bold mb-4  text-center ">Your Tickets</h1>
        <div className="overflow-y-auto h-screen w-full max-w-screen mt-4">
        {alltickets.map((ticket: TicketData) => {
          if (ticket.name === username) {
            return (
              <div key={ticket.id} className="mb-4">
                <Ticket
                  id={ticket.id}
                  name={ticket.name}
                  department={ticket.department}
                  created_on={ticket.created_on}
                  description={ticket.description}
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
      </div>
    );
        
  }
}
