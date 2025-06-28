import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  TextInput,
  SelectInput,
  EditButton,
  usePermissions,
  CreateButton,
  TopToolbar,
  Pagination,
  ExportButton,
  FilterButton
  //Filter,
} from "react-admin";
import React from 'react';



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
  <TextInput label="Departamento" source="departamento" />,
];

const ListActions = () => {
  const { permissions } = usePermissions();

  return (
    <TopToolbar>
      {permissions === 'admin' ? 
        <>
          <CreateButton /> 
          <FilterButton />
          <ExportButton /> 
        </>
      : undefined}

    </TopToolbar>
  );
};
const PostPagination = () => <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />;

const ActivosList = (props) => {

  const { permissions } = usePermissions();

  return (
    <List filters={filtros} {...props} actions={<ListActions/>} pagination={<PostPagination />}>
      <>

        <Datagrid rowClick="show">
          <TextField source="Nombre" />
          <TextField source="Marca" />
          <TextField source="Modelo" />
          {/* <TextField source="NumeroSerie" /> */}
          <TextField source="Estatus" />
          {/* <TextField source="Sucursal" /> */}
          <TextField source="Departamento" />
          {/* <TextField source="UsuarioAsignado"/> */}
          <DateField source="FechaAdquisicion" />
          {/* <DateField source="FechaExpiracion" /> */}
          <TextField source="Proveedor" />
          <NumberField source="Costo" options={{ style: 'currency', currency: 'USD' }} />
          <TextField source="Observaciones" />
          <NumberField source="StockTotal" />
          {permissions === 'admin'? <EditButton /> : undefined}
        </Datagrid>
      </>
    </List>
  );
};

export default ActivosList;
