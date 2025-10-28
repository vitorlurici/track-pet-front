import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./pages/auth/SignUp.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import RegisterPet from "./pages/register-pet/RegisterPet.tsx";
import ProfileUser from "./pages/profile-user/ProfileUser.tsx";
import ProfilePet from "./pages/profile-pet/ProfilePet.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/cadastro",
    element: <SignUp />,
  },
  {
    path: "/painel",
    element: <Dashboard />,
  },
  {
    path: "/cadastrar-pet",
    element: <RegisterPet />,
  },
  {
    path: "/perfil",
    element: <ProfileUser />,
  },
  {
    path: "/pet",
    element: <ProfilePet />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
