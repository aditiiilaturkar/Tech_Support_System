
import React , { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { FaSort, FaSortDown } from 'react-icons/fa';
import { Ticket } from '../admin/Ticket';
import { loginSuccess, setAllTickets, setCredentials } from '../../actions';
import TicketDetails from '../admin/TicketDetails';

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



export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const { isAdmin } = useSelector((state:any)=> state.auth);
  const { username } = useSelector((state: any) => state.auth);
  const [sortHighToLowPriority, seSortHighToLowPriority] = useState(false); 
  const { alltickets } = useSelector((state: any) => state.tickets);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSortToggle = () => {
    seSortHighToLowPriority(!sortHighToLowPriority);
  };

  let sortedTickets = [];
  if(alltickets) {
    sortedTickets = [...alltickets].sort((a, b) => {
      const priorityOrder = ['low', 'medium', 'high'];
    
      if (sortHighToLowPriority) {
        return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
      } else {
        return priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority);
      }
    });
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

        dispatch(setAllTickets(formattedTickets ?? [] ));
        
        setLoading(false);
      } catch (error) {
        dispatch(setAllTickets([]));
        
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [dispatch, loading]);

  useEffect(() => {
    const storedLoginState = localStorage.getItem('loginState');

    if (storedLoginState) {
      const storedDetails = JSON.parse(storedLoginState);

      dispatch(setCredentials({
        username: storedDetails.username,
        password: '',
        isAdmin: storedDetails.isAdmin,
        firstName: storedDetails.firstName,
        lastName: storedDetails.lastName,
      }));
      dispatch(loginSuccess());

      
      // navigate('/dashboardLayout');
    }
  }, []); 

  const createImageUrl = (imageData: any) => {
    const blob = new Blob([imageData], { type: 'image/png' }); 
    // console.log("\n URL.createObjectURL(blob) -- ", URL.createObjectURL(blob));
    return URL.createObjectURL(blob);
  };
  
  const handleCreateTicket = () => {

      navigate('/createTicket');
  }

  if(alltickets == undefined || sortedTickets == undefined) {
    return null;
  }

  if(isAdmin) {

    return (
      <div className="overflow-y-auto h-screen w-full max-w-screen mt-4">
         <button onClick={handleSortToggle}  className="absolute top-4 right-12 p-3 bg-blue-500 text-white rounded-full">
            {'asc' === 'asc' ? <FaSort /> : <FaSortDown />}
          </button>
        <div>
          <div className='mt-12'>
          {sortedTickets.map((ticket: TicketData) => {
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
                isAdmin={isAdmin}
              />
  
              )
  
            }
          })}
          </div>
         
        <Routes>
          <Route path="/ticket/:ticketId" element={<TicketDetails />} />
        </Routes>
        </div>
      </div>
    );  
  }else{
    return (
      <div className="overflow-y-auto h-screen w-full max-w-screen mt-4"> 
       <button onClick={handleSortToggle}  className="absolute top-4 ml-auto p-3 bg-blue-500 text-white rounded-full">
            {'asc' === 'asc' ? <FaSort /> : <FaSortDown />}
          </button>
        <button onClick={handleCreateTicket}  className="absolute top-5 right-12 mb-30 bg-blue-500 text-white px-4 py-2 rounded">
          Create Ticket
        </button>
        <h1 className="text-2xl font-bold mb-4  text-center ">Your Tickets</h1>
        <div className="overflow-y-auto h-screen w-full max-w-screen mt-4">
        {sortedTickets.map((ticket: TicketData) => {
          // console.log("\n hiiii ", ticket.name,username );
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
                  isAdmin={isAdmin}
                />
                <Routes>
                  <Route path="/ticket/:ticketId" element={<TicketDetails />} />
                </Routes>
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
