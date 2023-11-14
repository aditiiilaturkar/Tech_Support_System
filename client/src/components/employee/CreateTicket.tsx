import { useSelector } from 'react-redux'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';


interface FormData {
    priority: string;
    description: string;
    department: string;
    created_on: string;
    image: string | null;
    assign_to: string;
}

interface AdminOption {
  user_email: string;
  first_name: string;
  last_name: string;
}
const adminOptions = [
  {
    username: 'admin@gmail.com',
    firstName: 'admin',
    lastName: 'Admin lastname'
  },
  {
    username: 'admin2@gmail.com',
    firstName: 'admin2',
    lastName: 'Admin2 lastname'
  }
]
export default function CreateTicket() {
   const { username } = useSelector((state: any) => state.auth);
   const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        priority: 'high',
        description: '',
        department: '',
        created_on: '',
        image: null,
        assign_to: ''
      });
      const [adminOptions, setAdminOptions] = useState<AdminOption[]>([]);
      
      useEffect(() => {
        const fetchAdmins = async () => {
          try {
            const response = await fetch('http://localhost:8080/get_admins_data');
            const data = await response.json();
    
            if (data) {
              setAdminOptions(data);
            }
          } catch (error) {
            console.error('Error fetching admin data:', error);
          }
        };
    
        fetchAdmins();
      }, []); 
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // console.log("\n Aditiiiiii --- ", name, value);
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleFileChange = (event:  React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            // console.log("\n reader.result?.toString().split(',')[1] -- ", reader.result?.toString().split(',')[1]);
            setFormData({
              ...formData,
              image: reader.result?.toString().split(',')[1] || '', // Extract base64 part
            });
          };
          reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        try {
          const apiData = {
            department: formData.department,
            priority: formData.priority,
            description: formData.description,
            created_on: formData.created_on,
            created_by: username,
            image_data: formData.image,
            assign_to: formData.assign_to
          };
      
          console.log('apiData --- ', apiData);
      
          const response = await fetch('http://localhost:8080/create_ticket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData),
          });
      
      
          const data = await response.json();
    
          if (data.success) {
            // console.log('Ticket created successfully!');
            navigate('/dashboardLayout');
          } else {
            console.error('Failed to create ticket:', data.message);
          }
        } catch (error) {
          console.error('Error creating ticket:', error);
        }
      };
    
    
    return (
        <div className="flex justify-center items-center h-screen bg-gray-300">
        <div className="bg-white p-8 border border-gray-300 shadow-lg rounded-md w-150">
          <h1 className="text-2xl font-bold mb-4 text-center">Create Ticket</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-bold mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded"
                required
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded"
                rows={4}
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded"
                required
              >
                <option value="">Select Department</option>
                <option value="Accounts">Accounts</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
              </select>
            </div>
           
            <div className="mb-4">
              <label className="block font-bold mb-2">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 w-full rounded"
             
              />
            </div>
            <div className="mb-4">
            <label className="block font-bold mb-2">Assign To</label>
            <select
              name="assign_to"
              value={formData.assign_to}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded"
              required
            >
              <option value="">Select Admin</option>
              {adminOptions.map((admin, index) => (
                <option key={index} value={admin.user_email}>
                  {admin.first_name} {admin.last_name}
                </option>
              ))}
            </select>
          </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
          </div>
    </div>
      );
};
    