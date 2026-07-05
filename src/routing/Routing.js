import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home/Home";
import People from "../pages/people/People";
import Profile from "../pages/profile/Profile";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./privateRoute";
import PublicRoute from "./publicRoute";

const router = createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/people', element: <People /> },
      { path: '/profile/:uid', element: <Profile /> },
    ],
  },
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: '/signup',
    element: <PublicRoute><Signup /></PublicRoute>,
  },
]);

export default function Routing() {
  return <RouterProvider router={router} />;
}