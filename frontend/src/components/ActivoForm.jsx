
import {
  TextInput,
  DateInput,
  NumberInput,
  SimpleForm,
  SelectInput,
} from "react-admin";
import TipoCondicional from './TipoCondicional';

const ActivoForm = (props) => {

  return (
    <SimpleForm {...props}>
      <TextInput source="Nombre" />
      <TextInput source="Marca" />
      <TextInput source="Modelo" />
      
      <SelectInput
        source="Tipo"
        choices={[
          { id: "Hardware", name: "Hardware" },
          { id: "Software", name: "Software" },
        ]}
      />
      <TipoCondicional />
      <TextInput source="Departamento" />
      <DateInput source="FechaAdquisicion" />
      <TextInput source="Proveedor" />
      <NumberInput source="Costo" />
      <TextInput source="Observaciones" />
      <NumberInput source="StockTotal" label="Cantidad Total" />
    </SimpleForm>
  );
};

export default ActivoForm;
