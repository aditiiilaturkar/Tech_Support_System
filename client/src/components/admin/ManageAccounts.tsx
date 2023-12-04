
import { MdEdit } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { MdDisabledByDefault } from "react-icons/md";

import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { EditUserAccessComp } from "./EditUserAccessComp";
import { useSelector } from "react-redux";
 
export interface UsersAccessData {
    user_email: string;
    first_name: string;
    last_name: string;
    can_edit: boolean;
    can_delete: boolean;
}
export interface EditUserAccessProps {
    user_email: string;
    can_edit: boolean;
    can_delete: boolean;
}
 
const TABLE_HEAD = ["User", "Name", "Edit Status", "Delete Status", ""];
 
export default function ManageAccounts() {
    const [usersAccessData, setUsersAccessData] = useState<UsersAccessData[]>([]);
    const [editUserAccess, setEditUserAccess] = useState<null | EditUserAccessProps>(null);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [userListEndReached, setUserListEndReached] = useState(false);
    const [userListStartReached, setUserListStartReached] = useState(true);
    const [limit] = useState(5);

    const onEditClick = (usersAccessData: UsersAccessData) => {
        setEditUserAccess({
            user_email: usersAccessData.user_email,
            can_edit: usersAccessData.can_edit,
            can_delete: usersAccessData.can_delete
        })
        setOpen(!open);
    }
    const onNextClick = () => {
        setPage(page+1);
    }
    const onPreviousClick = () => {
        setPage(page-1);
    }
    useEffect(() => {
        const fetchUserAccessDetails = async () => {
          console.log("\n calling getusers -------");
          try {
            const response = await fetch(`http://localhost:8080/get_users_data/${page}/${limit}`);
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();
    
            if (responseData) {
              console.log("\n ...responseData.users --- ", ...responseData.users);
              setUsersAccessData([...responseData.users]);
              setUserListEndReached(responseData.reachedEnd);
              setUserListStartReached(responseData.reachedstart);
            } else {
              console.error('Empty data received');
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        };
    
        fetchUserAccessDetails();
      }, [page, limit, open]); 
  return (
    <>
    <Card className="h-full  m-20">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h2" color="blue-gray" className="text-4xl">
              Users list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all users and their comments
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usersAccessData.map(
              ({ user_email, first_name, last_name, can_edit, can_delete}, index) => {
                const isLast = index === usersAccessData.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        {/* <Avatar src={img} alt={name} size="sm" /> */}
                        <div className="flex flex-col">
                          <Typography
                            variant="h5"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {user_email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="h5"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {can_edit} {first_name} {last_name}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        {can_edit ? (
                          <FcApproval className="h-8 w-8" />
                        ) : (
                            <MdDisabledByDefault className="h-8 w-8"/>
                        )}
                      </div>
                    </td>
                    <td className={classes}>
                    {can_delete ? (
                          <FcApproval  className="h-8 w-8"/>
                        ) : (
                            <MdDisabledByDefault className="h-8 w-8"/>
                        )}
                    </td>
                    <td className={classes}>
                          <MdEdit className="h-8 w-8" onClick={() => onEditClick(usersAccessData[index])}/>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <div className="flex gap-2">
          {!userListStartReached && (
             <Button variant="outlined" size="sm" onClick={onPreviousClick}>
             Previous
           </Button>
          )}
          {!userListEndReached && (
            <Button variant="outlined" size="sm" onClick={onNextClick}>
            Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
    <div className="fixed flex items-center justify-center z-50">
    <EditUserAccessComp open={open} setOpen={setOpen} editUser={editUserAccess} />
    </div>
    </>
  );
}