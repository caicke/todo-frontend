import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

import Header from "../components/Header/Header";
import InputComponent from "../components/Input/Input";

interface IUserData {
    email: string;
    password: string;
}

const authenticateUser = async (userData: IUserData, onSuccess: () => void, onError: (message: string) => void, setIsLoading: (isLoading: boolean) => void) => {
    setIsLoading(true);
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, userData);
        if (response.status === 200) {
            localStorage.setItem("MY_TOKEN", response.data.access_token);
            localStorage.setItem("REFRESH_TOKEN", response.data.refresh_token);
            onSuccess();
        } else {
            onError(response.data.message);
        }
    } catch (error: any) {
        onError(error.response?.data?.message || 'An error occurred');
    } finally {
        setIsLoading(false);
    }
};

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        const userData = { email, password };
        authenticateUser(userData, () => navigate('/list'), toast.error, setIsLoading);
    };

    return (
        <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <Header
                    heading="Login to your account"
                    paragraph="Don't have an account yet? "
                    linkName="Signup"
                    linkUrl="/signup"
                />

                <InputComponent
                    id="email"
                    handleChange={(e) => setEmail(e.target.value)}
                    isRequired={true}
                    labelFor="inptEmail"
                    labelText="Email"
                    name="email"
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
                    name="password"
                    placeholder="yourpassword"
                    type="password"
                    value={password}
                />

                <button
                    disabled={isLoading}
                    type="submit"
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-10 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </>
    );
}

export default LoginPage;
