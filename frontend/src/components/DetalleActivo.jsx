import { Show, SimpleShowLayout, TextField, ReferenceField, Button } from "react-admin";
import DisponibilidadTable from "./DisponibilidadActivo";
import ShowActions from "./ShowActions";

const ActivosDetail = () => (
    < Show title='Detalles Del Activo' actions={<ShowActions />}>
    <SimpleShowLayout>
        <TextField source="id" />
        <ReferenceField source="Nombre" reference="activos">
            <TextField source="Nombre" />
        </ReferenceField>
        <TextField source="NumeroSerie" />
        <ReferenceField source="SucursalId" reference="sucursales">
            <TextField source="Nombre" />
        </ReferenceField>
        <h3>Disponibilidad en sucursales</h3>
        <DisponibilidadTable />
    </SimpleShowLayout>
  </Show >
);

export default ActivosDetail;