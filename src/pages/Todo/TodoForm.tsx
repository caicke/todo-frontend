import { useNavigate, useParams } from "react-router-dom";
import InputComponent from "../../components/Input/Input";
import { FormEvent, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { IJwtUserToken } from "../../interfaces/IJwtUserToken";
import toast, { Toaster } from "react-hot-toast";
import { ITodo } from "../../interfaces/ITodo";
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import api from "../../config/axiosConfig";

export function TodoFormPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {

        const fetchTodo = async () => {
            try {
                const token = window.localStorage.getItem("MY_TOKEN");
                if (!token)
                    return;

                const decoded = jwtDecode<IJwtUserToken>(token);

                const response = await api.get<ITodo>(`${process.env.REACT_APP_API_URL}/todos/${id}`);

                if (response.status === 200) {
                    setTitle(response.data.title);
                    setDescription(response.data.description);
                }
            }
            catch (err) {
                console.error('Failed to fetch user data', err);
            }
            finally {
                setIsLoading(false);
            }
        };

        if (id)
            fetchTodo();
    }, []);

    const handleReturn = () => {
        navigate("/list"); // Redirect to todo list
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = window.localStorage.getItem("MY_TOKEN");
        if (!token)
            return;

        const decoded = jwtDecode<IJwtUserToken>(token);

        const userId = (decoded.sub);

        if (id) {
            // Edit existing todo
            await editTodo(title, description, userId);
        }
        else {
            // Create new todo
            await createTodo(title, description, userId)
        }
    }

    async function editTodo(title: string, description: string, userId: string | undefined) {
        try {
            setIsLoading(true);

            const response = await api.put(`${process.env.REACT_APP_API_URL}/todos/${id}`, {
                title: title,
                description: description,
                userId: userId
            });

            if (response.status === 200) {
                toast.success("Task updated successfully.");
                navigate('/list');
            }
        } catch (err) {
            toast.error('Failed to edit todo.');
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function createTodo(title: string, description: string, userId: string | undefined) {
        try {
            setIsLoading(true);

            const response = await api.post(`${process.env.REACT_APP_API_URL}/todos`, {
                title: title,
                description: description,
                userId: userId
            });

            if (response.status === 204) {
                toast.success("Task created successfully.");
                navigate('/list');
            }
        } catch (err) {
            toast.error('Failed to create todo.');
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-lg font-semibold leading-6 text-blue-700">{id ? 'Edit' : 'Create a'} todo.</p>
                </div>
                <IconButton onClick={handleReturn} title="Return to list">
                    <Close titleAccess="Return to list" />
                </IconButton>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="gap-x-6 py-5 bg-gray-100 shadow rounded-md px-4">
                    <InputComponent
                        id="todo-title"
                        handleChange={(e) => setTitle(e.target.value)}
                        isRequired={true}
                        labelFor="todo-title"
                        labelText="Title"
                        name="txtTitle"
                        placeholder="Drink coffee"
                        type="text"
                        value={title}
                    />

                    <InputComponent
                        id="todo-description"
                        handleChange={(e) => setDescription(e.target.value)}
                        isRequired={true}
                        labelFor="todo-description"
                        labelText="Description"
                        name="txtDescription"
                        placeholder="Need to drink coffee 8AM to really start my day"
                        type="text"
                        value={description}
                    />
                </div>

                <button
                    disabled={isLoading}
                    type="submit"
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-10 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                    {isLoading ? 'Loading...' : (id ? 'Save' : 'Create')}
                </button>
            </form>


        </>
    );
}
