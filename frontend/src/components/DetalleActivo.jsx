import { Show, SimpleShowLayout, TextField } from "react-admin";
import DisponibilidadTable from "./DisponibilidadActivo";
import ShowActions from "./ShowActions";

const ActivosDetail = () => (
    < Show title='Detalles Del Activo' actions={<ShowActions />}>
    <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="Nombre" />
        <TextField source="Modelo" />
        <TextField source="Tipo" />
        <TextField source="Departamento" />
        <TextField source="Proveedor" />
        <TextField source="Costo" />
        <TextField source="Observaciones" />

        {/* <ReferenceField source="SucursalId" reference="sucursales">
            <TextField source="Nombre" />
        </ReferenceField> */}
        <h3>Disponibilidad en sucursales</h3>
        <DisponibilidadTable />
    </SimpleShowLayout>
  </Show >
);

export default ActivosDetail;