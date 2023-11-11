import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
  } from "@material-tailwind/react";
import { IT_support } from "../../images";    

  const isResolved = (status:string): boolean => {
    if(status == 'open')    return false;
    return true;
  } 

  export function Ticket({
    name, 
    dept,
    time,
    status,
    priority,
    handleClick,
    id,
    isAdmin
  }: TicketProps) {
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
          <Button variant="text" className="flex items-center gap-2  ${isResolved(status) ? 'text-red-500' : 'text-green-500'}">
            {isResolved(status) ? "Closed" : "Resolve"}
            {isResolved(status) ? <></> : (
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
            )}
          </Button>
        </a>

          ) : null}
            </div>
            <Typography color="gray" className="mb-2 mt-2 font-normal">
            et its own business model disruption is only part
            of the story et its own business model disruption is only part
            of the story et its own business model disruption is only part
            of the story et its own business model disruption is only part
            of the story et its own business model disruption is only part
            of the story et its own business model disruption is only part
            of the story
          </Typography>
          <Typography className=" text-slate-800 text-sm ml-auto mt-2">
            {time}
          </Typography>

        </CardBody>
      </Card>
    );
  }


interface TicketProps {
    name: string;
    dept: string;
    time: string;
    status: string;
    priority: string;
    id: number,
    handleClick: (id:number) => void;
    isAdmin?: boolean
  }