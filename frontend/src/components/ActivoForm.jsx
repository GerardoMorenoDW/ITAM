// components/ActivoForm.js
import {
    TextInput,
    DateInput,
    NumberInput,
    SimpleForm,
    SelectInput,
  } from "react-admin";

const ActivoForm = (props) => (
  <SimpleForm {...props}>
    <TextInput source="Nombre" />
    <TextInput source="Marca" />
    <TextInput source="Modelo" />
    <TextInput source="NumeroSerie" />
    <SelectInput source="Estatus" choices={[
                        { id: 'ACTIVE', name: 'ACTIVE' },
                        { id: 'INACTIVE', name: 'INACTIVE' },
                    ]}/>
    <SelectInput source="Ubicacion" choices={[
                        { id: 'Sucursal 1', name: 'Sucursal 1' },
                        { id: 'Sucursal 2', name: 'Sucursal 2' },
                        { id: 'Sucursal 3', name: 'Sucursal 3' },
                    ]}/>
    <TextInput source="Departamento" />
    <TextInput source="UsuarioAsignado" />
    <DateInput source="FechaAdquisicion" />
    <DateInput source="FechaExpiracion" />
    <TextInput source="Proveedor" />
    <NumberInput source="Costo" />
    <TextInput source="Observaciones" />
  </SimpleForm>
);
  
  export default ActivoForm;
  