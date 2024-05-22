import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

interface PrivateRouteProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('MY_TOKEN');
  const refreshToken = localStorage.getItem('REFRESH_TOKEN');

  const isTokenExpired = (token: string) => {
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (Date.now() >= exp * 1000) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    if (!token && !refreshToken) {
      toast.error('Session expired. Please log in again.');
      navigate('/', { replace: true });
      return;
    }

    if (token && isTokenExpired(token)) {
      if (refreshToken && !isTokenExpired(refreshToken)) {
        (async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('MY_TOKEN', data.access_token);
              window.location.reload();
            } else {
              throw new Error('Failed to refresh token');
            }
          } catch (error) {
            localStorage.removeItem('MY_TOKEN');
            localStorage.removeItem('REFRESH_TOKEN');
            toast.error('Session expired. Please log in again.');
            navigate('/', { replace: true });
          }
        })();
      } else {
        localStorage.removeItem('MY_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        toast.error('Session expired. Please log in again.');
        navigate('/', { replace: true });
      }
    }
  }, [token, refreshToken, navigate]);

  return token && !isTokenExpired(token) ? <>{children}</> : null;
};

export default PrivateRoute;