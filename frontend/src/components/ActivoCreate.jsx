import { Create } from "react-admin";
import ActivoForm from "./ActivoForm";

const ActivosCreate = (props) => (
  <Create {...props}>
    <ActivoForm />
  </Create>
);

export default ActivosCreate;
