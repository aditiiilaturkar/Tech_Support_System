interface LoginField {
    labelText: string;
    labelFor: string;
    id: string;
    name: string;
    type: string;
    autoComplete: string;
    isRequired: boolean;
    placeholder: string;
}

const loginFields: LoginField[] = [
    {
        labelText: "Email address",
        labelFor: "username",
        id: "username",
        name: "username",
        type: "email",
        autoComplete: "email",
        isRequired: true,
        placeholder: "Email address"
    },
    {
        labelText: "Password",
        labelFor: "password",
        id: "password",
        name: "password",
        type: "password",
        autoComplete: "current-password",
        isRequired: true,
        placeholder: "Password"
    },
    
]



const signUpFields: LoginField[] = [
    {
        labelText: "Email address",
        labelFor: "username",
        id: "username",
        name: "username",
        type: "email",
        autoComplete: "email",
        isRequired: true,
        placeholder: "Email address"
    },
    {
        labelText: "First Name",
        labelFor: "First Name",
        id: "firstname",
        name: "firstname",
        type: "firstname",
        autoComplete: "firstname",
        isRequired: true,
        placeholder: "firstname"
    },
    {
        labelText: "Last Name",
        labelFor: "Last Name",
        id: "lastname",
        name: "lastname",
        type: "lastname",
        autoComplete: "lastname",
        isRequired: true,
        placeholder: "lastname"
    },
    {
        labelText: "Password",
        labelFor: "password",
        id: "password",
        name: "password",
        type: "password",
        autoComplete: "current-password",
        isRequired: true,
        placeholder: "Password"
    },
    
]
export { loginFields, signUpFields };
