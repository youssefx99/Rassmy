import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from "./pages/Home.jsx";
import RootLayout from "./pages/Root.jsx";
import SignupPage from "./pages/Signup.jsx";
import SigninPage from "./pages/Signin.jsx";
const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: 'signup',
                element: <SignupPage/>
            },
            {
               path: 'signin',
                element: <SigninPage/>
            }
        ],
    },

]);
function App() {
    return(
        <RouterProvider router={router} >

        </RouterProvider>
    );
}

export default App
