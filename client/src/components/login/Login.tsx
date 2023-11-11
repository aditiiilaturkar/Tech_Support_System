import { useState, useEffect } from 'react';
import { loginFields } from "../fields";
import LoginInput from './LoginInput';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setCredentials, loginSuccess } from '../../actions';
// import Input from "./LoginInput";

const fields=loginFields;


let fieldsState: Record<string, string> = {};
fields.forEach(field => fieldsState[field.id] = '');


export default function Login(){
    const [loginState,setLoginState] = useState(fieldsState);
    const { isAuthenticated = false } = useSelector((state: any) => state.auth);
    const { isAdmin } = useSelector((state:any)=> state.auth);
    const { username, password } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch()  
    const navigate = useNavigate();

    useEffect(() => {   
    if (username && password) {
          setLoginState({ username: username, password: password, isAdmin: isAdmin });
        }
    }, [username, password, isAdmin]);

    useEffect(() => {
        const storedLoginState = JSON.parse(localStorage.getItem('loginState') || '{}');
        if (storedLoginState.username && storedLoginState.password) {
          setLoginState(storedLoginState);
          
          console.log("\n i am logged in -> ", storedLoginState.username);
          dispatch(setCredentials({ username: storedLoginState.username, password: storedLoginState.password, isAdmin: storedLoginState.isAdmin }));
          dispatch(loginSuccess());
          navigate('/dashboardLayout');  
        }
      }, []);
    
    const handleChange=(e: any)=>{
        const { id, value } = e.target;
        const updatedLoginState = { ...loginState, [id]: value };
        // localStorage.setItem('loginState', JSON.stringify(updatedLoginState));
        setLoginState(updatedLoginState);
    }

    const handleSubmit= async(e: any)=>{
        e.preventDefault();
        const {isAuthenticated, isAdmin} = await authenticateUser();
       
        if (isAuthenticated) {
            localStorage.setItem('loginState', JSON.stringify({...loginState, isAdmin}));
            dispatch(setCredentials({ username: loginState.username, password: loginState.password, isAdmin}));
            dispatch(loginSuccess());
            // console.log("\n i reached in auth success");
            navigate('/dashboardLayout');
        }
    }

    //Handle Login API Integration here
    const authenticateUser = (): { isAuthenticated: boolean; isAdmin: boolean } => {
        console.log("hello  here ", loginState);
        return {
            isAuthenticated : true,
            isAdmin: false
        };
    }
    

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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