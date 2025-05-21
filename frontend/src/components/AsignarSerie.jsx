import {
  Edit,
  useNotify,
  useRedirect,
  useRecordContext,
  ReferenceInput,
  SelectInput,
  TextInput,
  SimpleForm
} from "react-admin";
import { useEffect, useState } from "react";

const AsignarSerie = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const record = useRecordContext();
  const [originalSucursalId, setOriginalSucursalId] = useState(null);

  useEffect(() => {
    if (record) {
      setOriginalSucursalId(record.SucursalId);
    }
  }, [record]);

  // Esta función se ejecuta antes del PUT
  const handleTransform = async (data) => {
    try {
      if (originalSucursalId && data.SucursalId !== originalSucursalId) {
        const response = await fetch("http://localhost:5000/api/movimientos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ActivoId: data.ActivoId,
            SucursalOrigenId: originalSucursalId,
            SucursalDestinoId: data.SucursalId,
            Cantidad: 1,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al registrar el movimiento");
        }
      }

      return true; // React Admin sigue con el PUT normal
    } catch (error) {
      notify(error.message, { type: "error" });
      throw error; // detiene el PUT si algo falla
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm validate={handleTransform}>
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
};

export default AsignarSerie;
