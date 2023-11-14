import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import SideBar from '../dashboard/SideBar';
import { Button, Card, CardBody } from '@material-tailwind/react';
import { IoMdSend } from 'react-icons/io';
import { loginSuccess, setAllTickets, setCredentials } from '../../actions';

interface TicketData {
    id: number;
    name: string;
    department: string;
    priority: string;
    created_on: string;
    is_resolved: boolean;
    description:string;
    assign_to: string;
  }


interface Comment {
    comment: string;
    comment_by: string; 
  }
  

const TicketDetails: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const parsedTicketId = ticketId ? parseInt(ticketId, 10) : undefined;
  const { alltickets } = useSelector((state: any) => state.tickets);
  const { username, isAdmin } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState('');
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTicket, setCurrentTicket] = useState<TicketData>();
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
    }
  }, []); 


  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/get_ticket_details/${parsedTicketId}`);
        const data = await response.json();

        if (response.ok) {
          console.log('Ticket Details:', data);
          setCurrentTicket(data);
        } else {
          console.error('Failed to fetch ticket details:', response.statusText);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/get-comments/${ticketId}`);
        const data = await response.json();

        if (response.ok) {
            setAllComments(data);
        } else {
        //   setError(data.error);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        // setError('An error occurred while fetching comments.');
        setLoading(false);
      }
    };

    fetchComments();
  }, [ticketId]);

  const handleCommentSubmit = async () => {
    try {
      const commentData = {
        id: parsedTicketId,
        comment: newComment,
        comment_by: username,
      };

      const response = await fetch('http://localhost:8080/create-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        console.log('New Comment submitted successfully:', newComment);
        setAllComments((prevComments) => [
            ...prevComments,
            { comment: newComment, comment_by: username },
          ]);    
        setNewComment('');
      } else {
        console.error('Failed to submit comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

    const handleResolve = async () => {
    try {
      const response = await fetch(`http://localhost:8080/resolve_ticket/${parsedTicketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parsedTicketId
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        const updatedTickets = alltickets.map((ticket: TicketData) => {
          if (ticket.id === parsedTicketId) {
            return { ...ticket, status: 'resolved' };
          }
          return ticket;
        });
        dispatch(setAllTickets(updatedTickets));
        if(currentTicket)
            setCurrentTicket({...currentTicket, is_resolved: true});
      } else {
        console.error('Failed to resolve ticket:', data.message);
      }
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };


  const handleCommentChange = (e:  ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

    if(!currentTicket){
        return null;
    }
  return (
    <div className="bg-slate-50 flex flex-row flex-1 w-full">
      
         <div className="flex flex-col min-h-screen flex-shrink-0">
            <div className="w-40 bg-gray-800 h-screen mr-0  top-0 left-0">
                <SideBar />
            </div>
         </div>
        <div className='px-8 py-6 w-full'>
        <Card className="flex-row  ml-10 mr-10 border border-gray-300 shadow-lg p-8 mb-4 max-h-[calc(100vh-48px)] overflow-y-auto ">
        <CardBody className="w-full flex flex-col gap-2 ">
            <div className='self-center text-xl'>
            {currentTicket.department}
           </div>
         
            <div className='flex flex-row items-center'>
            <div className={`uppercase tracking-wide border px-2 py-1 text-sm rounded-xl 
                ${currentTicket.priority === 'high' ? 'border-red-500 text-red-800 bg-red-100' :
                    currentTicket.priority === 'medium' ? 'border-yellow-500 text-yellow-800 bg-yellow-100' :
                    'border-blue-500 text-blue-800 bg-blue-100'
                }`}>
                {currentTicket.priority}
                </div>
                <div className={`ml-auto uppercase tracking-wide border px-2 py-1 text-sm rounded-xl 
                ${currentTicket.is_resolved ? 'border-gray-500 text-gray-800 bg-gray-100' :
                    'border-green-500 text-white bg-green-500'
                }`}>
                {currentTicket.is_resolved ? 'Closed' : 'Open'}
                </div>
            </div>
            <div className='text-xl text-slate-500 my-4'>
            {currentTicket.description}
           </div>
         
            <img src={'https://picsum.photos/200/300'}
                className='max-h-[20rem] max-w-[40rem] mb-4'
            />
         
           <div className='flex flex-row items-center'>
           <div className='text-blue-500 text-sm'>
           {currentTicket.assign_to}
           </div>
           <div className='flex flex-row items-center ml-auto gap-2'>
           <div className='font-bold text-sm'>
            {currentTicket.name},
           </div>
           <div className='ml-auto text-sm text-slate-700'>
            {currentTicket.created_on}
           </div>

           </div>
 
           </div>
           <div className='border border-t-2 mt-4'>

            <div className='max-h-[20rem] overflow-y-auto mx-2'>
                {allComments.map((comment: any) => {
                    return (
                        <div className='flex flex-col my-6 pb-4 border-b-2'>
                            <span className='font-bold uppercase tracking-wider text-slate-500'>
                                {comment.comment_by}
                            </span>
                            <span className='text-slate-500'>
                                {comment.comment}

                            </span>
                         </div>   
                    )
                })

                }
            </div>
            {isAdmin ? (
              <>
                         <div className='flex flex-col'>
                         <div className="input-group relative">
                             <input
                                 className='h-[4rem] border rounded-xl w-full mt-4 px-3 border-slate-800 pr-10'
                                 placeholder='Write a comment'
                                 value={newComment}
                                 onChange={handleCommentChange}
                             />
                             <span
                                 className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer mt-1  text-blue-500 text-3xl"
                                 onClick={handleCommentSubmit}
                                
                             >
                                 <IoMdSend />
                             </span>
                         </div>
                         </div>
                         <div className='flex flex-col mt-2 items-center'>
                         {!currentTicket.is_resolved && (
                             <button
                             className="bg-red-500 text-white font-bold uppercase px-4 py-2 rounded mb-4 hover:bg-red-600 transition-colors mt-2
                             "
                             onClick={handleResolve}
                             >
                             Resolve
                             </button>
                         )}
                         </div>
                         </>
            ) : null}
 
           </div>


           
        </CardBody>
        </Card>

        </div>
    </div>
  );
};

export default TicketDetails;
// alltickets.find((ticket: TicketData) => ticket.id === parsedTicketId);
//   console.log("\n alltickets --- ", alltickets);
//   console.log("\n hello --- ", currentTicket);

//   const handleResolve = async () => {
//     try {
//       const response = await fetch(`http://localhost:8080/resolve_ticket/${resolveTicketId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           id: resolveTicketId
//         }),
//       });
  
//       const data = await response.json();
  
//       if (data.success) {
//         // console.log('Ticket resolved successfully!');
//         const updatedTickets = alltickets.map((ticket: TicketData) => {
//           if (ticket.id === resolveTicketId) {
//             return { ...ticket, status: 'resolved' };
//           }
//           return ticket;
//         });
//         dispatch(setAllTickets(updatedTickets));
//         // setShowPopup(false);
//       } else {
//         console.error('Failed to resolve ticket:', data.message);
//       }
//     } catch (error) {
//       console.error('Error resolving ticket:', error);
//     }
//   };
