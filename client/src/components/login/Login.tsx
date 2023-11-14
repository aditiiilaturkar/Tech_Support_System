import { useState, useEffect } from 'react';
import { loginFields } from "../fields";
import LoginInput from './LoginInput';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, loginSuccess } from '../../actions';

import axios from 'axios';

const fields=loginFields;


let fieldsState: Record<string, string> = {};
fields.forEach(field => fieldsState[field.id] = '');



export default function Login(){
    const [loginState,setLoginState] = useState(fieldsState);
    const { isAuthenticated = false } = useSelector((state: any) => state.auth);
    const { isAdmin } = useSelector((state:any)=> state.auth);
    const { username, password, firstName, lastName } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {   
    if (username && password) {
          setLoginState({ username: username, password: password, isAdmin: isAdmin });
        }
    }, [isAuthenticated, username, password, isAdmin]);

    useEffect(() => {
        const storedLoginState = localStorage.getItem('loginState');
    
        if (storedLoginState) {
          const storedDetails = JSON.parse(storedLoginState);
    
          setLoginState({
            username: storedDetails.username,
            password: '', 
            isAdmin: storedDetails.isAdmin,
          });
    
    
          dispatch(setCredentials({
            username: storedDetails.username,
            password: '',
            isAdmin: storedDetails.isAdmin,
            firstName: storedDetails.firstName,
            lastName: storedDetails.lastName,
          }));
          dispatch(loginSuccess());
    
          
          navigate('/dashboardLayout');
        }
      }, []); 

    const handleChange=(e: any)=>{
        const { id, value } = e.target;
        const updatedLoginState = { ...loginState, [id]: value };

        setLoginState(updatedLoginState);
    }

    const handleSubmit= async(e: any)=>{
        e.preventDefault();
        const {isAuthenticated, isAdmin, firstName, lastName, username } = await authenticateUser();
        if (isAuthenticated) {
              localStorage.setItem('loginState', JSON.stringify({
                username: username,
                isAdmin: isAdmin,
                firstName: firstName,
                lastName: lastName
              }));
    
            dispatch(setCredentials({ username: loginState.username, password: loginState.password, isAdmin, firstName, lastName}));
            dispatch(loginSuccess());
            navigate('/dashboardLayout');
        }
    }
    const authenticateUser = async () => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                user_email: loginState.username,
                password: loginState.password,
            });
    
            const { isAuthenticated, isAdmin, first_name, last_name, user_email } = response.data;
            // console.log("\n hi there ----- ", isAuthenticated, isAdmin, first_name, last_name);
            return { isAuthenticated, isAdmin, firstName: first_name, lastName: last_name, username: user_email };
        } catch (error) {
            console.error('Error during authentication:', error);
            return { isAuthenticated: false, isAdmin: false, firstName: "", lastName: "" };
        }
   };
    

    return(
        <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">
            {
                fields.map(field=>
                        <LoginInput
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }
        </div>

        <FormAction handleSubmit={handleSubmit} text="Login"/>

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
                onSubmit={handleSubmit}
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