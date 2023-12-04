
import Header from "../login/LoginHeader";
import SignUp from "./SignUp";

  
export default function SignUpPage(){
    return(
        <div className="border-color: rgb(100,200,150) h-screen items-center flex flex-1 flex-col mt-56">
             <Header
                heading="Sign up here"
                paragraph="Get your issue fixed!"
                linkName=""
                linkUrl="#"
                />
                <SignUp />
        </div>
    )
}