import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLayout } from "./components/layout";
import { RequireAuth } from "./components/auth/RequireAuth";
import { Dashboard } from "./Pages/Dashboard";
import { AdminLogin } from "./Pages/Auth";
import { DetalleSolicitud, ListaSolicitudes } from "./Pages/Solicitudes";
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
import {
  DetalleProveedor,
  EditarProveedor,
  ListaProveedores,
  RegistrarProveedor,
} from "./Pages/Proveedores";
import {
  DetalleMedicamento,
  EditarMedicamento,
  ListaMedicamentos,
  RegistrarMedicamento,
} from "./Pages/Medicamentos";
import {
  DetalleUsuario,
  EditarUsuario,
  ListaUsuarios,
  RegistrarUsuario,
} from "./Pages/Usuarios";

const router = createBrowserRouter([
  // Auth Routes
  {
    path: "/login",
    element: <AdminLogin />,
  },
  // Protected Routes with AdminLayout
  {
    path: "/",
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
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
        path: "solicitudes/:id",
        element: <DetalleSolicitud />,
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
      {
        path: "proveedores",
        element: <ListaProveedores />,
      },
      {
        path: "proveedores/nuevo",
        element: <RegistrarProveedor />,
      },
      {
        path: "proveedores/:id",
        element: <DetalleProveedor />,
      },
      {
        path: "proveedores/:id/editar",
        element: <EditarProveedor />,
      },
      {
        path: "medicamentos",
        element: <ListaMedicamentos />,
      },
      {
        path: "medicamentos/nuevo",
        element: <RegistrarMedicamento />,
      },
      {
        path: "medicamentos/:id",
        element: <DetalleMedicamento />,
      },
      {
        path: "medicamentos/:id/editar",
        element: <EditarMedicamento />,
      },
      {
        path: "usuarios",
        element: <ListaUsuarios />,
      },
      {
        path: "usuarios/nuevo",
        element: <RegistrarUsuario />,
      },
      {
        path: "usuarios/:id",
        element: <DetalleUsuario />,
      },
      {
        path: "usuarios/:id/editar",
        element: <EditarUsuario />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
