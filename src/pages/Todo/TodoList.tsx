import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IJwtUserToken } from "../../interfaces/IJwtUserToken";
import { ITodo } from "../../interfaces/ITodo";
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Header from "../../components/Header/Header";
import toast, { Toaster } from "react-hot-toast";
import { Icon } from "@mui/material";

export function TodoListPage() {
    const navigate = useNavigate();

    const [userName, setUsername] = useState("you");
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingTodoId, setLoadingTodoId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const token = window.localStorage.getItem("MY_TOKEN");
                if (!token)
                    return;

                const decoded = jwtDecode<IJwtUserToken>(token);

                const userId = decoded.sub;
                const response = await axios.get<ITodo[]>(`${process.env.REACT_APP_API_URL}/todos/from/${userId}`,
                    { headers: { "Authorization": `Bearer ${token}` } });

                if (response.status === 200) {
                    setTodos(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch user data', err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchUser = () => {
            try {
                const token = window.localStorage.getItem("MY_TOKEN");
                if (!token)
                    return;

                const decoded = jwtDecode<IJwtUserToken>(token);
                setUsername(decoded.fullName);
            }
            catch (err) {
                console.log('Failed to fetch user info', err);
            }
        }

        fetchTodos();
        fetchUser();
    }, []);

    const handleEditClick = (todo: ITodo) => {
        navigate(`/todo/${todo.id}`)
    };

    const handleResolveClick = async (todo: ITodo) => {
        setIsLoading(true);
        setLoadingTodoId(todo.id);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/todos/${todo.id}`, {
                title: todo.title,
                description: todo.description,
                userId: todo.userId,
                isCompleted: !todo.isCompleted
            });

            if (response.status === 200) {
                setTodos((prevTodos) =>
                    prevTodos.map((t) =>
                        t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t
                    )
                );
            }
        }
        catch (err) {
            toast.error('Failed to edit todo.');
            console.log(err);
        }
        finally {
            setIsLoading(false);
            setLoadingTodoId(null);
        }
    }

    const handleDeleteClick = async (todoId: string) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/todos/${todoId}`);

            if (response.status === 204) {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
                toast.success("Task deleted successfully.");
            }
        } catch (err) {
            toast.error('Failed to delete todo.');
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // Lógica para logout
        window.localStorage.removeItem("MY_TOKEN");
        navigate("/"); // Redirect to login page
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Toaster />
            <div className="flex justify-between items-center p-4">
                <Header
                    heading={'Hello, ' + userName + '.'}
                    paragraph="These are your tasks."
                    linkName="Create a new one."
                    linkUrl="/todo"
                />
                <IconButton onClick={handleLogout} title="Logout" className="text-white">
                    <LogoutIcon />
                </IconButton>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                <ul className="divide-y divide-gray-100 bg-gray-50 p-4">
                    {todos.length === 0 && <div>No tasks created.</div>}

                    {todos.map((todo) => (
                        <li key={todo.id} className={`relative flex flex-col gap-x-6 py-5 shadow rounded-md px-4 mb-4 ${todo.isCompleted ? 'bg-gray-600' : 'bg-gray-800'}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-blue-300">{todo.title}</p>
                                        <p className="mt-1 text-xs leading-5 text-gray-300">{todo.description}</p>
                                        <p className="mt-1 text-xs leading-5 text-gray-400">Last update at {new Date(todo.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDeleteClick(todo.id)}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent 
                                                   text-xs font-medium rounded text-white bg-red-500 hover:bg-red-400 
                                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        title="Edit task"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => handleEditClick(todo)}
                                className="inline-flex items-center mt-2 px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                title="Edit task"
                                style={{ width: "20%" }}
                            >
                                <Icon>
                                    <EditIcon fontSize="small"></EditIcon>
                                </Icon> Edit
                            </button>
                            <button
                                onClick={() => handleResolveClick(todo)}
                                className={`mt-6 w-full py-2 ${todo.isCompleted ? 'bg-[#fb7185] text-white font-medium rounded hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 text-white font-medium rounded hover:bg-green-700 focus:ring-green-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${loadingTodoId === todo.id ? 'cursor-not-allowed opacity-50' : ''}`}
                                title={todo.isCompleted ? 'Undo resolved' : 'Mark as resolved'}
                                disabled={loadingTodoId === todo.id}
                            >
                                {loadingTodoId === todo.id ? 'Loading...' : (todo.isCompleted ? 'Undo resolved' : 'Mark as resolved')}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
