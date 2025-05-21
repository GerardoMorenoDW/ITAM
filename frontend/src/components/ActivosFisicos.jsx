import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    SelectInput,
    TextInput,
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
    <SelectInput
      label="Sucursal"
      source="sucursal"
      choices={[
        { id: '1', name: 'Sucursal 1' },
        { id: '2', name: 'Sucursal 2' },
        { id: '3', name: 'Sucursal 3' },
    ]}
    />
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
  