import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    SelectInput,
    TextInput,
    ReferenceInput,
    usePermissions,
    DateField,
    FunctionField,
    Pagination,
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

const PostPagination = () => <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />;

const ActivosFisicosList = () => {
  const { permissions } = usePermissions();
  return(
    <List filters={filtros} pagination={<PostPagination />}>
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
        <FunctionField
          label="Fecha Mant/exp"
          render={(record) => 
            record.FechaMantenimiento == null ? (
              <DateField record={record} source="FechaExpiracion" />
            ) : (
              <DateField record={record} source="FechaMantenimiento" />
            )
          }
        />
        {permissions === 'admin' ? <EditButton /> : undefined}
      </Datagrid>
    </List>
  )
};

export default ActivosFisicosList;
  