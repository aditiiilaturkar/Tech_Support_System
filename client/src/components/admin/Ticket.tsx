import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
  } from "@material-tailwind/react";
  import { useState, useEffect } from 'react';

  const isResolved = (status:string): boolean => {
    if(status == 'open')    return false;
    return true;
  } 

  export function Ticket({
    name, 
    department,
    created_on,
    description,
    status,
    priority,
    handleClick,
    id,
    isAdmin
  }: TicketProps) {
    console.log("\n am i called?" , department);
    return (
      <Card className=" flex-row h-full ml-10 mr-10 border border-gray-300 shadow-lg p-8 mb-4">
        <CardBody className="w-full flex flex-col">
            <div className="flex gap-4 flex-row items-center">
            <Typography variant="h4" className=" text-blue-500">
            {name}
          </Typography>
          <Typography variant="h6" color="gray" className="text-sm uppercase">
            {priority}
          </Typography>
          {isAdmin ? (
          <a href="#" className="inline-block ml-auto" onClick={() => isResolved(status) ? null : handleClick(id)}>
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
            <Typography color="gray" className="mb-2 mt-2 font-normal">
              {description}
          </Typography>
          <Typography className=" text-slate-800 text-sm ml-auto mt-2">
            {/* {created_on} */}
            <TimestampDisplay timestamp={created_on} />
          </Typography>

        </CardBody>
      </Card>
    );
  }

  const TimestampDisplay: React.FC<{ timestamp: string }> = ({ timestamp }) => {
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
  
  // Example usage:
  const App: React.FC = () => {
    const timestamp = '2023-11-13T02:53:20Z';
  
    return (
      <div>
        <h1>Timestamp Display</h1>
        <TimestampDisplay timestamp={timestamp} />
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
    handleClick: (id:number) => void;
    isAdmin?: boolean
  }