import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLayout } from "./components/layout";
import { Dashboard } from "./Pages/Dashboard";
import { AdminLogin } from "./Pages/Auth";
import { ListaSolicitudes } from "./Pages/Solicitudes";
import {
  DetalleDonacion,
  EditarDonacion,
  ListaDonaciones,
  RegistroDonacion,
} from "./Pages/Donaciones";
import {
  DetalleInventario,
  InventarioAlmacen,
  InventarioGeneral,
  MovimientosInventario,
} from "./Pages/Inventario";
import {
  CrearDespacho,
  DetalleDespacho,
  HistorialDespachos,
  ListaDespachos,
} from "./Pages/Despachos";

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
      {
        path: "donaciones",
        element: <ListaDonaciones />,
      },
      {
        path: "donaciones/nueva",
        element: <RegistroDonacion />,
      },
      {
        path: "donaciones/:id",
        element: <DetalleDonacion />,
      },
      {
        path: "donaciones/:id/editar",
        element: <EditarDonacion />,
      },
      {
        path: "inventario",
        element: <InventarioGeneral />,
      },
      {
        path: "inventario/almacen",
        element: <InventarioAlmacen />,
      },
      {
        path: "inventario/medicamento/:id",
        element: <DetalleInventario />,
      },
      {
        path: "inventario/movimientos",
        element: <MovimientosInventario />,
      },
      {
        path: "despachos",
        element: <ListaDespachos />,
      },
      {
        path: "despachos/:id",
        element: <CrearDespacho />,
      },
      {
        path: "despachos/:id/detalle",
        element: <DetalleDespacho />,
      },
      {
        path: "despachos/historial",
        element: <HistorialDespachos />,
      },
      {
        path: "despachos/historial/:id",
        element: <DetalleDespacho />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
