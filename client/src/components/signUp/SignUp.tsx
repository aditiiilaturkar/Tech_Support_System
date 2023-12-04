import { useState, ChangeEvent } from 'react';
import { signUpFields } from "../fields";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import axios from 'axios';
import SignUpInput from './SignUpInput';

const fields=signUpFields;


let fieldsState: Record<string, string> = {};
fields.forEach(field => fieldsState[field.id] = '');

console.log("\n fieldsState ", fieldsState);
// fieldsState.admin = false;


export default function SignUp(){
    const [signupState,setSignupState] = useState(fieldsState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    
    const handleAdminChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        setIsAdmin(e.target.checked);
    }
    const handleChange=(e: any)=>{
        const { id, value } = e.target;
        
        const updatedSignUpState = { ...signupState, [id]: value };
        console.log("\n updatedSignUpState --", updatedSignUpState);
        setSignupState(updatedSignUpState);
    }

    
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        console.log("\n i am in handleSubmit");
        try {
            const response = await axios.post('http://localhost:8080/sign_up', {
                user_email: signupState.username,
                first_name: signupState.firstname,
                last_name: signupState.lastname,
                is_admin: isAdmin,
                password: signupState.password,
            });

            console.log("\n i am in handleSubmit", {
                user_email: signupState.username,
                first_name: signupState.firstname,
                last_name: signupState.lastname,
                is_admin: isAdmin,
                password: signupState.password,
            });
    
            const {success, message } = response.data;
            if(success){
                navigate('/');
            }else {
                console.log("\n Failed to create new user");
            }
        } catch (error) {
            console.error('Error during user creation:', error);
        }
   };
    

    return(
        <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">
            {
                fields.map(field => {
                    return (
                        <div className='my-7'>
                            <SignUpInput
                            key={field.id}
                            handleChange={handleChange}
                            value={signupState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                            />
                        </div>   
                    )
                })
            }
            <div className='mt-20'>
            <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={handleAdminChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label htmlFor="isAdmin" className='mx-3'>Admin</label>

            </div>

        </div>

        <FormAction handleSubmit={handleSubmit} text="SignUp"/>

      </form>
    )
}


export function FormAction({
    handleSubmit,
    type='Button',
    action='submit',
    text
}: FormActionProps){
    return(
        <>
        {
            type==='Button' ?
            <button
                type={action}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-300 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 mt-10"
                onClick={handleSubmit}
            >

                {text}
            </button>
            :
            <></>
        }
        </>
    )
}


interface FormActionProps {
    handleSubmit: (event: React.FormEvent) => void;
    type?: 'Button';
    action?: 'submit';
    text: string;
}