import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from 'react';
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
  isAdmin
}: TicketProps) {

  return (
    <Card className="flex-row h-full ml-10 mr-10 border border-gray-300 shadow-lg p-8 mb-4">
      <CardBody className="w-full flex flex-col">
        <Link to={`/ticket/${id}`} className="hover:text-blue-500">
          <div className="flex gap-4 flex-row items-center">
        <Typography
          variant="h6"
          className={` uppercase ${getPriorityColor(priority)}`}
          >
          {priority}
        </Typography>
            <Typography className="text-blue-500">
              {name}
            </Typography>
      
            {isAdmin ? (
              <a href="#" className="inline-block ml-auto">
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
              </a>
            ) : null}
          </div>
          <Typography color="gray" className="mb-2 mt-2 text-xl text-slate-500">
            {description}
          </Typography>
          <Typography className="text-slate-800 text-sm ml-auto mt-2">
            <TimestampDisplay timestamp={created_on} />
          </Typography>
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
    isAdmin?: boolean
  }