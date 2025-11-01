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
import Rastreamento from "./pages/rastreamento/Rastreamento.tsx";

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
    path: "/pet/:id",
    element: <ProfilePet />,
  },
  {
    path: "/rastreamento/:id",
    element: <Rastreamento />,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
