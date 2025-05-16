import {
    Edit,
    SimpleForm,
    TextInput,
    SelectInput,
    ReferenceInput
  } from "react-admin";
  
  const AsignarSerie = (props) => (
    <Edit {...props}>
      <SimpleForm>
        <ReferenceInput source="ActivoId" reference="activos" disabled>
          <SelectInput optionText="Nombre" disabled />
        </ReferenceInput>
        <TextInput source="NumeroSerie" label="Número de Serie" />
        <ReferenceInput source="SucursalId" reference="sucursales">
          <SelectInput optionText="Nombre" />
        </ReferenceInput>
        <SelectInput
          source="Estado"
          choices={[
            { id: "DISPONIBLE", name: "DISPONIBLE" },
            { id: "EN USO", name: "EN USO" },
            { id: "EN MANTENIMIENTO", name: "EN MANTENIMIENTO" },
          ]}
        />
      </SimpleForm>
    </Edit>
  );

  export default AsignarSerie;
  