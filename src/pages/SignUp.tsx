import InputComponent from "../components/Input/Input";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header/Header";
import { FormEvent, useState } from "react";
import axios from "axios";

interface IUserSignUp {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

}

function SignUpPage() {
    const navigate = useNavigate();
    const [isValidUser, setIsValidUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        signUp()
    }

    const signUp = async () => {
        setIsLoading(true);

        await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
            .then(function (response) {
                // handle success
                if (response.status === 201) {
                    // redirect to login page
                    toast.success("Account has been registered successfully.")
                    navigate('/');
                }
                else {
                    toast.error(response.data.message);
                }
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
            })
            .finally(function () {
                // always executed
                setIsLoading(false);
            });
    }


    return (
        <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <Header
                    heading="Create a new account"
                    paragraph="Already have an account? "
                    linkName="Login now."
                    linkUrl="/"
                />

                <InputComponent
                    id="firstName"
                    handleChange={(e) => setFirstName(e.target.value)}
                    isRequired={true}
                    labelFor="inptFirstName"
                    labelText="First Name"
                    name="txtfirstName"
                    placeholder="John"
                    type="text"
                    value={firstName}
                />

                <InputComponent
                    id="lastName"
                    handleChange={(e) => setLastName(e.target.value)}
                    isRequired={true}
                    labelFor="inptLastName"
                    labelText="Last Name"
                    name="txtlastName"
                    placeholder="Doe"
                    type="text"
                    value={lastName}
                />

                <InputComponent
                    id="email"
                    handleChange={(e) => setEmail(e.target.value)}
                    isRequired={true}
                    labelFor="inptEmail"
                    labelText="Email"
                    name="txtemail"
                    placeholder="example@email.com"
                    type="email"
                    value={email}
                />

                <InputComponent
                    id="password"
                    handleChange={(e) => setPassword(e.target.value)}
                    isRequired={true}
                    labelFor="inptPassword"
                    labelText="Password"
                    name="txtpassword"
                    placeholder="yourpassword"
                    type="password"
                    value={password}
                />

                <InputComponent
                    id="confirmPassword"
                    handleChange={(e) => setConfirmPassword(e.target.value)}
                    isRequired={true}
                    labelFor="inptConfirmPassword"
                    labelText="Confirm password"
                    name="txtconfirmPassword"
                    placeholder=""
                    type="password"
                    value={confirmPassword}
                />
                {password && confirmPassword && password !== confirmPassword && (
                    <small className="text-red-600">Passwords do not match.</small>
                )}

                <button
                    disabled={isLoading || (password !== null && confirmPassword !== null && password !== confirmPassword)}
                    type="submit"
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-10
                                 ${isLoading || (password !== null && confirmPassword !== null && password !== confirmPassword) ?
                            'cursor-not-allowed opacity-50' :
                            ''}`}

                >
                    {isLoading ? 'Loading...' : 'Sign Up'}
                </button>
            </form>
        </>
    );
}

export default SignUpPage;
