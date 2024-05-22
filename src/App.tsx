import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import { TodoListPage } from './pages/Todo/TodoList';
import { TodoFormPage } from './pages/Todo/TodoForm';
import PrivateRoute from './components/Auth/PrivateRoute';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/list" element={
              <PrivateRoute>
                <TodoListPage />
              </PrivateRoute>
            } />
            <Route path="/todo/:id?" element={
              <PrivateRoute>
                <TodoFormPage />
              </PrivateRoute>
            } />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
