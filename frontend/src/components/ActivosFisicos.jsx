import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    SelectInput,
    TextInput,
    ReferenceInput,
  } from "react-admin";

  const filtros = [
    <TextInput label="Buscar" source="q" alwaysOn />,
    <SelectInput
      label="Estado"
      source="Estado"
      choices={[
            { id: "DISPONIBLE", name: "DISPONIBLE" },
            { id: "EN USO", name: "EN USO" },
            { id: "EN MANTENIMIENTO", name: "EN MANTENIMIENTO" },
          ]}
    />,
    <TextInput label="Numero de Serie" source="NumeroSerie" />,
    <ReferenceInput label="Sucursal" source="SucursalId" reference="sucursales" alwaysOn>
      <SelectInput optionText="Nombre" />
    </ReferenceInput>
  ];
  
  const ActivosFisicosList = () => (
    <List filters={filtros}>
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
  