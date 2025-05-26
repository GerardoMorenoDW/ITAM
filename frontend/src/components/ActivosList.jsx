import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  TextInput,
  SelectInput,
  EditButton,
  //Filter,
} from "react-admin";
//import {Modal} from './Modal'
//import FormularioEquipos from './FormularioEquipos';
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

const ActivosList = (props) => {
  /* const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
 */
  return (
    <List filters={filtros} {...props}>
      <>
        {/* <button onClick={openModal}>Agregar Activo</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <FormularioEquipos isOpen={isModalOpen} onClose={closeModal} />
        </Modal> */}

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
          <EditButton />
        </Datagrid>
      </>
    </List>
  );
};

export default ActivosList;
