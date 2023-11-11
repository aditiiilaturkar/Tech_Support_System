import Header from "./LoginHeader";
import Login  from "./Login";
  
export default function LoginPage(){
    return(
        <div className="border-color: rgb(100,200,150)">
             <Header
                heading="Login to your account"
                paragraph="Get your issue fixed!"
                linkName=""
                linkUrl="#"
                />
                <Login />
        </div>
    )
}