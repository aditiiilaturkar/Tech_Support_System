import React, { useEffect, useState } from "react";
import { EditUserAccessProps } from "./ManageAccounts";


interface EditUserAccessCompProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editUser:  EditUserAccessProps | null;
}

export const EditUserAccessComp: React.FC<EditUserAccessCompProps> = ({
  open,
  setOpen,
  editUser
}: EditUserAccessCompProps) => {
  const [canEdit, setCanEdit] = useState(editUser?.can_edit);
  const [canDelete, setCanDelete] = useState(editUser?.can_delete);
  // console.log("\n editUser --- ", editUser?.can_edit, editUser?.can_delete, canEdit, canDelete);
  useEffect(() => {
    setCanEdit(editUser?.can_edit);
  }, [editUser?.can_edit]);
  
  useEffect(() => {
    // console.log("\n editUser?.can_delete); in useEffect --- ", editUser?.can_delete);
    setCanDelete(editUser?.can_delete);
  }, [editUser?.can_delete]);
  useEffect(() => {
    setCanEdit(editUser?.can_edit);
    setCanDelete(editUser?.can_delete);
  }, [editUser]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanEdit(event.target.checked);
  };
  const handleDeleteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanDelete(event.target.checked);
    
  };

  const handleSubmit = async () => {
    try {
      console.log("\n making access update call -------");
      const url = "http://localhost:8080/edit_user_comments_access";
      const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_email: editUser?.user_email,
              can_edit: canEdit,
              can_delete: canDelete
            }),
        });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData = await response.json();
      if(responseData.success){

      }else{
        console.error('Error updating user access');
      }
    }catch(error){
      console.error('Error updating user access:', error);
    }
    handleClose();
  };
  if(!open) {
    return <></>;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ">
    <div className="bg-white p-8 rounded shadow-lg w-1/2 order-gray-300">
      
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Access for {editUser?.user_email}</h2>
          <table className="w-full">
    
          <div className="flex items-center mb-4">
          <input type="checkbox" id="checkbox1" className="h-5 w-5 mr-2" checked={canEdit}
           onChange={handleEditChange}/>
          <label htmlFor="checkbox1">Edit Access</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="checkbox2" className="h-5 w-5 mr-2" checked={canDelete}   onChange={handleDeleteChange}/>
          <label htmlFor="checkbox2">Delete Access</label>
        </div>
          </table>
        </div>
      
      <div className="mt-auto flex flex-col items-end">
        <div className="flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-full hover:bg-blue-600 transition-colors"
          onClick={handleSubmit}>
            Submit
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

// export default EditUserAccessComp;
