// components/ActivoForm.js
import {
    TextInput,
    DateInput,
    NumberInput,
    SimpleForm,
    SelectInput,
    useRecordContext,
  } from "react-admin";

const ActivoForm = (props) => {
  const record = useRecordContext(); // o props.record si no usás context
  return (
    <SimpleForm {...props}>
      <TextInput source="Nombre" />
      <TextInput source="Marca" />
      <TextInput source="Modelo" />
      <SelectInput source="Tipo" choices={[
                          { id: 'Hardware', name: 'Hardware' },
                          { id: 'Software', name: 'Software' }
                      ]}/>
      <TextInput source="NumeroSerie" />
      {/* <SelectInput source="Sucursal" choices={[
                          { id: '1', name: 'Sucursal 1' },
                          { id: '2', name: 'Sucursal 2' },
                          { id: '3', name: 'Sucursal 3' },
                      ]}/> */}
      <TextInput source="Departamento" />
      <TextInput source="UsuarioAsignado" />
      <DateInput source="FechaAdquisicion" />
      <DateInput source="FechaExpiracion" />
      <TextInput source="Proveedor" />
      <NumberInput source="Costo" />
      <TextInput source="Observaciones" />
      <NumberInput source="StockTotal" label="Cantidad Total" />
    </SimpleForm>
  )
};
  
export default ActivoForm;
  