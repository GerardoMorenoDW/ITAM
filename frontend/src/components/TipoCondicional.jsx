import { useWatch, useFormContext } from "react-hook-form";

import {
  TextInput,
  DateInput,
  SelectInput,
} from "react-admin";

const TipoCondicional = () => {
  const { control } = useFormContext(); // ← obtiene el control del formulario de react-admin
  const tipo = useWatch({ control, name: "Tipo" });

  return (
    <>
      {tipo === "Hardware" && (
        <>
            <TextInput source="NumeroSerie" label="Número de Serie" />
            <SelectInput
            source="SubCategoria"
            choices={[
                { id: "CPU", name: "CPU" },
                { id: "Portatil", name: "Portatil" },
                { id: "Teclado", name: "Teclado" },
                { id: "Mouse", name: "Mouse" },
                { id: "Monitor", name: "Monitor" },
            ]}
            />
        </>
      )}
      {tipo === "Software" && (
         <>
            <SelectInput
            source="SubCategoria"
            choices={[
                { id: "Lincencia", name: "Lincencia" },
                { id: "Contrato", name: "Contrato" },
            ]}
            />
            <DateInput source="FechaExpiracion" label="Fecha de Expiración" />
        </>
      )}
    </>
  );
};

export default TipoCondicional;