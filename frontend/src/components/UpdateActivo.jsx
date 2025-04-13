import { Edit } from "react-admin";
import ActivoForm from "./ActivoForm";

const ActivosEdit = (props) => (
  <Edit {...props}>
    <ActivoForm />
  </Edit>
);

export default ActivosEdit;
