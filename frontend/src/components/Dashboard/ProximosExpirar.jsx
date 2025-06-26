import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    SelectInput,
    TextInput,
    ReferenceInput
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
    <ReferenceInput label="Sucursal" source="SucursalId" reference="sucursales" alwaysOn>
      <SelectInput optionText="Nombre" />
    </ReferenceInput>,
    <ReferenceInput label="Empleado" source="Asignado" reference="empleados" alwaysOn>
      <SelectInput optionText="Nombre" />
    </ReferenceInput>
  ];

const ActivosListExp = (props) => {
  return (
    <List filters={filtros} perPage={10}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="NombreActivo" />
        <TextField source="NumeroSerie" />
        <ReferenceField source="SucursalId" reference="sucursales">
          <TextField source="Nombre" />
        </ReferenceField>
        <TextField source="Estado" />
        <ReferenceField label= "Asignado a" source="Asignado" reference="empleados">
          <TextField source="Nombre" />
        </ReferenceField>
      </Datagrid>
    </List>
);
};

export default ActivosListExp;
