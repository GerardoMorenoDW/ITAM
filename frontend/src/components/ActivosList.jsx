import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  TextInput,
  SelectInput,
  //Filter,
} from "react-admin";
//import {Modal} from './Modal'
//import FormularioEquipos from './FormularioEquipos';
import React from 'react';



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
  <SelectInput
    label="Sucursal"
    source="sucursal"
    choices={[
      { id: 'Sucursal 1', name: 'Sucursal 1' },
      { id: 'Sucursal 2', name: 'Sucursal 2' },
      { id: 'Sucursal 3', name: 'Sucursal 3' },
  ]}
  />
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

        <Datagrid rowClick="edit">
          <TextField source="Nombre" />
          <TextField source="Marca" />
          <TextField source="Modelo" />
          <TextField source="NumeroSerie" />
          <TextField source="Estatus" />
          {/* <TextField source="Sucursal" /> */}
          <TextField source="Departamento" />
          <TextField source="UsuarioAsignado"/>
          <DateField source="FechaAdquisicion" />
          {/* <DateField source="FechaExpiracion" /> */}
          <TextField source="Proveedor" />
          <NumberField source="Costo" options={{ style: 'currency', currency: 'USD' }} />
          <TextField source="Observaciones" />
          <DateField source="StockTotal" />
        </Datagrid>
      </>
    </List>
  );
};

export default ActivosList;
