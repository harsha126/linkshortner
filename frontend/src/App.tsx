import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import { Navigate } from "react-router-dom";
import HomePage from './Pages/HomePage';
import { JSX } from 'react';
import { Avatar, Button, ConfigProvider } from 'antd';
import ErrorBoundary from './Pages/ErrorBoundary';
import LinkRedirect from './Pages/LinkRedirect';

function App() {

  const isAuthenticated = () => {
    return localStorage.getItem("accessToken") !== null;
  };



  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const logout = () => {
      localStorage.removeItem('accessToken');
      routes.navigate('/login');
    }
    return isAuthenticated() ? <>
      <Avatar style={{ backgroundColor: '#4096FF', color: 'white', position: 'fixed', top: '20px', left: '20px' }} size='large'>U</Avatar>
      <Button onClick={logout} variant='solid' type="primary" size='large' style={{ position: 'fixed', top: '20px', right: '20px' }}>logout</Button>
      {children}
    </> : <Navigate to="/login" />;
  };

  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <LoginPage />
      ),
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignUpPage />
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      )
    },
    {
      path: "/:id",
      element: <LinkRedirect />

    }
  ]);


  return (
    <div id="appp" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', minWidth: '100vw' }}>
      <ConfigProvider>
        <ErrorBoundary>
          <RouterProvider router={routes} />
        </ErrorBoundary>
      </ConfigProvider>
    </div>
  )
}

export default App
