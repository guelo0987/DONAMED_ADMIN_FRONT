import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLayout } from "./components/layout";
import { Dashboard } from "./Pages/Dashboard";
import { AdminLogin } from "./Pages/Auth";
import { ListaSolicitudes } from "./Pages/Solicitudes";

const router = createBrowserRouter([
  // Auth Routes
  {
    path: "/login",
    element: <AdminLogin />,
  },
  // Protected Routes with AdminLayout
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "solicitudes",
        element: <ListaSolicitudes />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
