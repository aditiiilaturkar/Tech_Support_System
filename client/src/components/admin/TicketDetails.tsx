import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import SideBar from '../dashboard/SideBar';
import { Card, CardBody } from '@material-tailwind/react';
import { IoMdSend } from 'react-icons/io';
import { loginSuccess, setAllTickets, setCredentials } from '../../actions';
import Loader from '../Loader';
import { TimestampDisplay } from './Ticket';
import Toast from '../Toast';

interface TicketData {
    id: number;
    created_by: string;
    department: string;
    priority: string;
    created_on: string;
    is_resolved: boolean;
    description:string;
    image_data: any;
    assign_to: string;
    comments_disable: boolean;
  }


interface Comment {
    commentid: number;
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
  const [toastMessage, setToastMessage] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [reachedCommentsEnd, setReachedCommentsEnd] = useState(false);

  console.log("\n reachedCommentsEnd --- ", reachedCommentsEnd);
  const [edit, setEdit] = useState<{isEditing: boolean; commentid: number| null, editedComments: string}>({
    isEditing: false,
    commentid: null,
    editedComments: ""
  });
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
        const response = await fetch(`http://localhost:8080/get-comments/${ticketId}/${page}/${limit}`);
        const responseData = await response.json();

        if (response.ok) {
          const {comments, reachedEnd } = responseData;
          if(comments.length) {
            console.log("\n [...allComments, comments] -- ", [...allComments, ...comments])
            setAllComments([...allComments, ...comments]);

          }
            setReachedCommentsEnd(reachedEnd);
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
  }, [ticketId, limit, page]);


  const onLoadMoreCommentsClick = () => {
    setPage(page+1);

  }

  const handleCommentSubmit = async () => {
    if(currentTicket && currentTicket.comments_disable) {
      setToastMessage("Comments are disabled on this ticket!");
      return;
    }
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
      const responseData = await response.json();
      if (response.ok) {

        console.log('New Comment submitted successfully:', newComment);
        setAllComments((prevComments) => [
            ...prevComments,
            { comment: newComment, comment_by: username, commentid: responseData.commentId },
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


  const handleDisableComments = async () => {
    try {
      const url = `http://localhost:8080/disable_comments?ticketId=${ticketId}&userEmail=${username}&disable=${!currentTicket?.comments_disable}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      const responseData = await response.json();
      if (responseData.success) {
        const updatedTickets = alltickets.map((ticket: TicketData) => {          
          if (ticket.id === parsedTicketId) {
            return { ...ticket, disable_commeents: !currentTicket?.comments_disable };
          }
          return ticket;
        });
        dispatch(setAllTickets(updatedTickets));
        if(currentTicket){
          setCurrentTicket({...currentTicket, comments_disable: !currentTicket?.comments_disable});
        }
          
      } else {
        console.error('Failed to resolve ticket');
      }
    } catch (error) {
      console.error('Error in disabling ticket comments:', error);

    }
  }
  const handleCommentChange = (e:  ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const onDeleteComment =async (com: Comment) => {
    if(com.comment_by != username) {
      setToastMessage("Only owner of the comment can delete it!");
      return;
    }else {
      try {
        const response = await fetch(`http://localhost:8080/delete_comment/${com.commentid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseData = await response.json();
        if(responseData.success){
          setAllComments(allComments.filter(comment => comment.commentid != com.commentid
            ))
        }else{
          console.error('Error in deleting comment');
        }
  
      }catch(error) {
        console.error('Error in deleting comments:', error);
      }  
    }
  }


  const onEditClick = (comment: Comment) => {
    if(comment.comment_by === username) {
      setEdit({
        isEditing: !edit.isEditing,
        commentid: comment.commentid,
        editedComments: comment.comment
      })  
    }else {
      setToastMessage("Only owner of the comment can edit it!");
      return;

    }
  }

  const handleEditCommentChange = (e:  ChangeEvent<HTMLInputElement>) => {
    setEdit({...edit, editedComments: e.target.value});
  };

  const handleCommentEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/edit_comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentid: edit.commentid,
          comment: edit.editedComments,
          useremail: username
        }),
      });

      const responseData = await response.json();
      if (response.ok) {

        console.log('Comment editted successfully:', edit.editedComments);
        const updatedComments = [...allComments];
        updatedComments.map((comment: Comment) => {
          if(comment.commentid == edit.commentid){
            comment.comment = edit.editedComments;
            comment.comment_by = username;
          }
        });
        setAllComments(updatedComments);    
        setEdit({
          isEditing: !edit.isEditing,
          editedComments: '',
          commentid: null
        });
      } else {
        console.error('Failed to submit comment:', response.statusText);
      }

    }catch(error) {
      console.error("unable to edit comment ");
    }
  }
    if(!currentTicket ||  loading){
        return <Loader />;
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
            {currentTicket.image_data && (
  <img
  src={`data:image/jpeg;base64,${currentTicket.image_data}`}
  alt={`Ticket ${ticketId} Image`}
  className='max-h-[40rem] max-w-[30rem] mb-4 mx-auto block'
/>
            )}    
                  

           <div className='flex flex-row items-center'>
           <div className='text-blue-500 text-sm'>
           {currentTicket.assign_to}
           </div>
           <div className='flex flex-row items-center ml-auto gap-2'>
           <div className='font-bold text-sm'>
            {currentTicket.created_by},
           </div>
           <div className='ml-auto text-sm text-slate-700'>
            
            <TimestampDisplay timestamp={currentTicket.created_on} />
           </div>

           </div>
 
           </div>
           <div className='border border-t-2 mt-4'>

            <div className='max-h-[20rem] overflow-y-auto mx-2'>
                {allComments.map((comment: Comment) => {
                  // console.log("\n comment ", comment);
                    return (
                        <div className='flex flex-col my-6 pb-4 border-b-2'>
                            <span className='font-bold uppercase tracking-wider text-slate-500'>
                                {comment.comment_by}
                            </span>
                            {edit.isEditing && edit.commentid == comment.commentid ? (
                          <div className="input-group relative">
                             <input
                                 className='h-[4rem] border rounded-xl w-full mt-4 px-3 border-slate-800 pr-10'
                                 placeholder='edit the comment'
                                 value={edit.editedComments}
                                 onChange={handleEditCommentChange}
                             />
                             <span
                                 className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer mt-1  text-blue-500 text-3xl"
                                 onClick={handleCommentEditSubmit}
                                
                             >
                                 <IoMdSend />
                             </span>
                         </div>
                          
                            ) : (
                            <span className='text-slate-500'>
                                {comment.comment}

                            </span>

                            )}
                            <div className='flex-col ml-auto'>
                              <button className='mr-3 text-cyan-700' onClick={() => onEditClick(comment)}>
                                Edit
                              </button>
                              <button className=' text-red-500' onClick={() => onDeleteComment(comment)}>
                                Delete
                              </button>
                            </div>  
                         </div>   
                    )
                })

                }
            </div>
            {!reachedCommentsEnd && (
            <div className='flex flex-col self-end'>
            <button  className='flex flex-col self-end text-blue-400 hover:text-blue-600' onClick={onLoadMoreCommentsClick}>
              ...Load more comments
            </button>
          </div>

            )}
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

            {isAdmin ? (
              <>

                    <button className="text-slate-400  flex font-bold uppercase  py-2 rounded mb-4  transition-colors mt-2 ml-auto mr-4"
                      onClick={handleDisableComments}
                    >
                      {currentTicket.comments_disable ? (
                        <p>Enable comments</p>
                      ) : (
                        <p>Diable comments</p>
                      )}
                    </button>

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
        <Toast message={toastMessage} showToast={toastMessage.length ? true : false}  setShowToast={() => {
          setToastMessage('');
        }}/>
    </div>
  );
};

export default TicketDetails;
