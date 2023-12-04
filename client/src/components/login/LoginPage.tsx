import Header from "./LoginHeader";
import Login  from "./Login";
  
export default function LoginPage(){
    return(
        <div className="border-color: rgb(100,200,150) h-screen items-center flex flex-1 flex-col mt-56">
             <Header
                heading="Login to your account"
                paragraph="Get your issue fixed!"
                linkName="Create an account"
                linkUrl="http://localhost:3000/signUp"
                />
                <Login />
        </div>
    )
}