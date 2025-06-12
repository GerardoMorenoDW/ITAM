import {
    useRecordContext,
    //useRedirect,
    //useNotify,
} from "react-admin";
import { useState, useEffect } from "react";
import ShowActions from "./ShowActions";


const ShowMovimientos = () => {
    const record = useRecordContext();
    //const redirect = useRedirect();
    //onst notify = useNotify();

    const [movimientos, setMovimientos] = useState([]);
    //const [stockDisponible, setStockDisponible] = useState(0);
    /* const [form, setForm] = useState({
        SucursalOrigenId: '',
        SucursalDestinoId: '',
        Cantidad: ''
    }); */

    /* useEffect(() => {
        if (form.SucursalOrigenId) {
            fetch(`http://localhost:5000/disponibilidad/${record.id}`)
                .then(res => res.json())
                .then(result => {
                    const sucursalOrigen = result.data.find(
                        s => s.SucursalId === form.SucursalOrigenId
                    );
                    setStockDisponible(sucursalOrigen?.Cantidad || 0);
                });
        }

    }, [form.SucursalOrigenId, record?.id]); */

    useEffect(() => {
        fetch(`http://localhost:5000/movimientos/${record.id}`)
            .then(res => res.json())
            .then(result => {
                setMovimientos(result);
            });


    }, [record?.id]);



    return (
        <div style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <div style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}><ShowActions/></div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Sucursal Origen</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Sucursal Destino </th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Disponible</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Fecha de Movimiento</th>
                    </tr>
                </thead>
                <tbody>
                    {movimientos.map((item, index) => (
                        <tr key={index}>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.SucursalOrigen}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.SucursalDestino}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.Cantidad}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.Fecha}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowMovimientos;
