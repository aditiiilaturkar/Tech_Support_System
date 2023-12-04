import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

const isResolved = (status: string): boolean => {
  return status === 'resolved';
}
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-700'; 
    case 'medium':
      return 'text-yellow-700';
    case 'low':
      return 'text-blue-700'; 
    default:
      return 'text-gray-700'; 
  }
};
export function Ticket({
  name,
  department,
  created_on,
  description,
  status,
  priority,
  id,
  isAdmin,
  onTicketDelete
}: TicketProps) {

  return (
    <Card className="h-full ml-4 mr-4 border border-gray-300 shadow-lg p-4 mb-4">
      <CardBody className="w-full flex flex-col">
        <Link to={`/ticket/${id}`} className="hover:text-blue-500">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-2">
              <Typography variant="h6" className={`uppercase ${getPriorityColor(priority)}`}>
                {priority}
              </Typography>
              <Typography className="text-blue-500 text-sm">{name}</Typography>
            </div>
            {isAdmin && (
              <div className="flex items-center w-full mb-2 ml-auto">
                <Button
                  variant="text"
                  className={`flex items-center gap-2 ${isResolved(status) ? 'text-gray-500' : 'text-red-500'}`}
                >
                  {isResolved(status) ? 'Closed' : 'Resolve'}
                  {!isResolved(status) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  )}
                </Button>
              </div>
            )}
            <Typography color="gray" className="text-slate-500 text-sm mb-2">
              {description}
            </Typography>
            <div className="flex items-center justify-between w-full">
              <Typography className="text-slate-800 text-sm">
                <TimestampDisplay timestamp={created_on} />
              </Typography>
              <Button
                variant="text"
                className={"flex items-center text-red-400 text-xs"}
                onClick={() => onTicketDelete(id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Link>
      </CardBody>
    </Card>
  );
  
}


 export  const TimestampDisplay: React.FC<{ timestamp: string }> = ({ timestamp }) => {
    const [formattedTimestamp, setFormattedTimestamp] = useState<string>('');
  
    useEffect(() => {
      const date = new Date(timestamp);
  
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
  
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
      setFormattedTimestamp(formattedDate);
    }, [timestamp]);
  
    return (
      <div>
        <p>{formattedTimestamp}</p>
      </div>
    );
  };
  

interface TicketProps {
    name: string;
    department: string;
    created_on: string;
    status: string;
    priority: string;
    description: string;
    id: number,
    isAdmin?: boolean,
    onTicketDelete?: any

  }