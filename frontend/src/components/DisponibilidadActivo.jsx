import { useEffect, useState } from "react";
import { useRecordContext, fetchUtils } from "react-admin";

const DisponibilidadTable = () => {
  const record = useRecordContext();
  const [disponibilidad, setDisponibilidad] = useState([]);

  useEffect(() => {
    if (!record) return;

    const fetchDisponibilidad = async () => {
      try {
        const { json } = await fetchUtils.fetchJson(
          `http://localhost:5000/disponibilidad/${record.id}`
        );
        setDisponibilidad(json);
      } catch (error) {
        console.error("Error obteniendo disponibilidad:", error);
      }
    };

    fetchDisponibilidad();
  }, [record]);

  if (!disponibilidad["data"] || disponibilidad["data"].length === 0) {
    return <div>No hay disponibilidad registrada.</div>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Sucursal</th>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Disponible</th>
        </tr>
      </thead>
      <tbody>
        {disponibilidad["data"].map((item, index) => (
        <tr key={index}>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.Nombre}</td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.Cantidad}</td>
        </tr>
        ))}
        <tr>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>Stock Total</td>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{disponibilidad.StockTotal}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default DisponibilidadTable;
