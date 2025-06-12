import { Show, SimpleShowLayout, TextField, TabbedShowLayout } from "react-admin";
import DisponibilidadTable from "./DisponibilidadActivo";
import ShowActions from "./ShowActions";
import MovimientosActivos from "./MovimientosActivos";


const ActivosDetail = () => (
    < Show title='Detalles Del Activo' actions={<ShowActions />}>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Descripcion">
                <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField source="Nombre" />
                    <TextField source="Modelo" />
                    <TextField source="Tipo" />
                    <TextField source="Departamento" />
                    <TextField source="Proveedor" />
                    <TextField source="Costo" />
                    <TextField source="Observaciones" />
                </SimpleShowLayout>
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Disponibilidad">
                <h3>Disponibilidad en sucursales</h3>
                <DisponibilidadTable />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Movimientos">
                <h3>Movimientos del activo</h3>
                <MovimientosActivos />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show >
);

export default ActivosDetail;