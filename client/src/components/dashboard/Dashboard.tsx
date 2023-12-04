
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Ticket } from '../admin/Ticket';
import { initialTicketState, loginSuccess, setAllTickets, setCredentials, TicketState } from '../../actions';
import TicketDetails from '../admin/TicketDetails';
import Loader from '../Loader';
import { FilterTickets } from './FilterTickets';
import { initializeUseSelector } from 'react-redux/es/hooks/useSelector';

interface TicketData {
  id: number;
  name: string;
  department: string;
  priority: string;
  created_on: string;
  status: string;
  description:string;
  resolved_on?: string;
  assign_to: string;
}

const initialTicketState2: TicketState = {
  alltickets: [] 
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const { isAdmin } = useSelector((state:any)=> state.auth);
  const { username } = useSelector((state: any) => state.auth);
  
  const [sortOptions, setSortOptions] = useState({
    factor: 'priority',
    order: 'asc',
  });
  const [filterOptions, setFilterOptions] = useState({
    factor: 'date',
    from: "",
    to: ""
  })
  const [filter, setFilter] = useState(false);
  const { alltickets } = useSelector((state: any) => state.tickets);
  const [displayTickets, setDisplayTickets] = useState(alltickets);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const sort = () => {
    let sortedTickets = [];
    if(alltickets) {
       sortedTickets = [...alltickets].sort((a, b) => {
        switch (sortOptions.factor) {
          case 'priority':
            return sortOptions.order === 'asc' ? a.priority.localeCompare(b.priority) : b.priority.localeCompare(a.priority);
          case 'submissionTime':
            return sortOptions.order === 'asc' ? a.created_on.localeCompare(b.created_on) : b.created_on.localeCompare(a.created_on);
          case 'status':
            return sortOptions.order === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
         
          default:
            return 0;
        }
      });
      // dispatch(setAllTickets(sortedTickets));
      setDisplayTickets(sortedTickets);
      console.log("\n alltickets -- ", alltickets);

    }
  }
  const handleSortToggle = (event: any) => {
    const { name, value } = event.target;
    setSortOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
    sort();
  };
  useEffect(() => {
    setDisplayTickets(alltickets);
  }, [alltickets])

  useEffect(() => {
    console.log("filterOptions --- ", filterOptions);
    console.log("\n alltickets -- ", alltickets);
    filterTickets();
  }, [filter, filterOptions.to, filterOptions.from])

  const filterTickets = () => {
    if(alltickets && alltickets.length) {
      const filteredTickets = alltickets.filter((ticket : TicketData) => {
        const createdDate = new Date(ticket.created_on);
        const resolvedDate = new Date(ticket.resolved_on || '2024-01-01');
        const fromDate = new Date(filterOptions.from);
        const toDate = new Date(filterOptions.to);
      
        // return createdDate >= fromDate && createdDate <= toDate;
        if (filterOptions.factor === 'resolvedOn' && resolvedDate) {
          return resolvedDate >= fromDate && resolvedDate <= toDate;
        } else if (filterOptions.factor === 'createdOn') {
          return createdDate >= fromDate && createdDate <= toDate;
        }
      });
      console.log("\n filteredTickets --- ", filteredTickets);
      // dispatch(setAllTickets(filteredTickets));
      setDisplayTickets(filteredTickets);
  
    }
  } 
  const onTicketDelete = async(deleteTicketId: number) => {
    try {
      
      const response = await fetch(`http://localhost:8080/delete_ticket/${deleteTicketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if(data){
        const updatedTickets = alltickets.filter((ticket: any) => ticket.id != deleteTicketId);
        dispatch(setAllTickets(updatedTickets));
      }else {
        console.error("\n Unable to delete!");
      }
    }catch(error){
      console.error("\n Unable to delete!");
    }
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
          status: ticket.is_resolved ? 'closed' : 'open',
          assign_to: ticket.assign_to,
          image: ticket.image_data ? createImageUrl(ticket.image_data) : null,
        }));
        formattedTickets.forEach((ticket:TicketData, index: number) => {
          const resolvedDate = new Date('2024-01-12');
          resolvedDate.setDate(resolvedDate.getDate() + index); 
          ticket.resolved_on = resolvedDate.toISOString();
        });
        console.log("\n formattedTickets -- ", formattedTickets);
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

  const onFilterClick = () => {
    setFilter(!filter);
  }

  if(alltickets == undefined || displayTickets == undefined) {
    return <div className='ml-[56rem]'>
      <Loader />
    </div>
  }

  

  if(isAdmin) {
    return (
      <div className="overflow-y-auto h-screen w-full max-w-screen mt-4">
        <div className="flex items-center justify-between px-4 py-2">
          <button className='flex self-end text-blue-600 hover:text-blue-600' onClick={onFilterClick}>
            Filter
          </button>
          <div className="flex items-center">
            <label className="text-sm text-gray-600 mr-2">Sort by:</label>
            <select
              name="factor"
              value={sortOptions.factor}
              onChange={handleSortToggle}
              className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="priority">Priority</option>
              <option value="submissionTime">Submission Time</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
    
        <div className="mt-6">
          {displayTickets.map((ticket: TicketData) => {
            if (ticket.assign_to === username) {
              return (
                <div key={ticket.id} className="mb-4">
                  <Ticket
                    id={ticket.id}
                    name={ticket.name}
                    department={ticket.department}
                    description={ticket.description}
                    created_on={ticket.created_on}
                    status={ticket.status}
                    priority={ticket.priority}
                    isAdmin={isAdmin}
                    onTicketDelete={onTicketDelete}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
    
        <Routes>
          <Route path="/ticket/:ticketId" element={<TicketDetails />} />
        </Routes>
    
        <FilterTickets
          filter={filter}
          setFilter={setFilter}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      </div>
    );
  }else{
    return (
      <div className="overflow-y-auto h-screen w-full max-w-screen mt-4"> 
     <div className='flex flex-row-reverse items-start gap-2 mt-4 mr-4'>
        <button onClick={handleCreateTicket} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Ticket
        </button>
        <div className="flex items-center mt-4">
        <label className="text-sm text-gray-600 mr-2">
          Sort by:
        </label>
        <select
          name="factor"
          value={sortOptions.factor}
          onChange={handleSortToggle}
          className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="priority">Priority</option>
          <option value="submissionTime">Submission Time</option>
          <option value="status">Status</option>
        </select>
      </div>
 
    </div>

        <h1 className="text-2xl font-bold mb-4  text-center ">Your Tickets</h1>
        <div className="overflow-y-auto h-screen w-full max-w-screen mt-4">
        {displayTickets.map((ticket: TicketData) => {
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
