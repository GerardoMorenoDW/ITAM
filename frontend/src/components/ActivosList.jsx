import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  TextInput,
  SelectInput,
  Filter,
} from "react-admin";
import {Modal} from './Modal'
import FormularioEquipos from './FormularioEquipos';
import React, { useState } from 'react';



const filtros = [
  <TextInput label="Buscar" source="q" alwaysOn />,
  <SelectInput
    label="Estado"
    source="estado"
    choices={[
      { id: "Operativo", name: "Operativo" },
      { id: "En reparación", name: "En reparación" },
      { id: "Dado de baja", name: "Dado de baja" },
    ]}
  />,
  <TextInput label="Departamento" source="departamento" />,
  <TextInput label="Ubicación" source="ubicacion" />,
];


const ActivosList = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <List filters={filtros} {...props}>
      <>
        <button onClick={openModal}>Agregar Activo</button>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <FormularioEquipos isOpen={isModalOpen} onClose={closeModal} />
        </Modal>

        <Datagrid rowClick="edit">
          <TextField source="Nombre" />
          <TextField source="Marca" />
          <TextField source="Modelo" />
          <TextField source="NumeroSerie" />
          <TextField source="Estado" />
          <TextField source="Ubicacion" />
          <TextField source="Departamento" />
          <TextField source="UsuarioAsignado" />
          <DateField source="FechaAdquisicion" />
          <TextField source="Proveedor" />
          <NumberField source="Costo" options={{ style: 'currency', currency: 'USD' }} />
          <TextField source="Observaciones" />
        </Datagrid>
      </>
    </List>
  );
};

export default ActivosList;
