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
        <TextField source="NombreActivo" />
        <TextField source="NumeroSerie" />
        <ReferenceField source="SucursalId" reference="sucursales">
          <TextField source="Nombre" />
        </ReferenceField>
        <TextField source="Estado" />
        <EditButton />
      </Datagrid>
    </List>
  );
  
  export default ActivosFisicosList;
  