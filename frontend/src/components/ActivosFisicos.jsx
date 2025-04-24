import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
  } from "react-admin";
  
  const ActivosFisicosList = () => (
    <List>
      <Datagrid>
        <TextField source="id" />
        <ReferenceField source="ActivoId" reference="activos" label="Activo">
          <TextField source="Nombre" />
        </ReferenceField>
        <TextField source="NumeroSerie" />
        <ReferenceField source="SucursalId" reference="sucursales">
          <TextField source="Nombre" />
        </ReferenceField>
        <TextField source="Estatus" />
        <EditButton />
      </Datagrid>
    </List>
  );
  
  export default ActivosFisicosList;
  