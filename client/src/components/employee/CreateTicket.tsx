import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
  } from "@material-tailwind/react";
import React, { useState, ChangeEvent, FormEvent } from 'react';


interface FormData {
    priority: string;
    description: string;
    department: string;
    time: string;
    image: File | null;
}

export default function CreateTicket({

}) {
    const [formData, setFormData] = useState<FormData>({
        priority: '',
        description: '',
        department: '',
        time: '',
        image: null,
      });
      
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log("\n Aditiiiiii --- ", name, value);
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({
          ...formData,
          image: file,
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Here you can handle submitting the ticket data, including the image upload
        // You can use formData.priority, formData.description, etc. to access the form fields
        console.log('Form submitted:', formData);
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
              <label className="block font-bold mb-2">Time</label>
              <input
                type="datetime-local"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 w-full rounded"
                required
              />
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
    