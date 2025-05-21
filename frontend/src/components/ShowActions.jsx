import {
    useRecordContext,
    useRedirect,
    useNotify,
} from "react-admin";
import {
    Button as MuiButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";

const ShowActions = () => {
    const record = useRecordContext();
    const redirect = useRedirect();
    const notify = useNotify();

    const [openTransfer, setOpenTransfer] = useState(false);
    const [sucursales, setSucursales] = useState([]);
    const [stockDisponible, setStockDisponible] = useState(0);
    const [form, setForm] = useState({
        SucursalOrigenId: '',
        SucursalDestinoId: '',
        Cantidad: ''
    });

    useEffect(() => {
        // Obtener lista de sucursales
        fetch('http://localhost:5000/sucursales')
            .then(res => res.json())
            .then(data => setSucursales(data));
    }, []);

    useEffect(() => {
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

    }, [form.SucursalOrigenId, record?.id]);

    const handleSubmit = () => {
        const { SucursalOrigenId, SucursalDestinoId, Cantidad } = form;

        if (SucursalOrigenId === SucursalDestinoId) {
            return notify("La sucursal origen y destino no pueden ser iguales", { type: 'warning' });
        }

        if (parseInt(Cantidad) > stockDisponible ) {
            return notify(`Cantidad supera el stock disponible (${stockDisponible})`, { type: 'warning' });
        }

        if (!Cantidad || parseInt(Cantidad) === 0) {
            return notify("Cantidad no ingresada o igual a 0", { type: 'warning' });
        }

        // Aquí harías el POST a tu API para guardar el movimiento
        fetch('http://localhost:5000/api/movimientos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ActivoId: record.id,
                SucursalOrigenId,
                SucursalDestinoId,
                Cantidad: parseInt(Cantidad)
            })
        }).then(() => {
            notify("Transferencia realizada correctamente", { type: 'success' });
            setOpenTransfer(false);
        });
    };

    return (
        <>
            <MuiButton onClick={() => setOpenTransfer(true)} variant="outlined">
                Transferir
            </MuiButton>

            <Dialog open={openTransfer} onClose={() => setOpenTransfer(false)}>
                <DialogTitle>Transferencia</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Sucursal Origen"
                        value={form.SucursalOrigenId}
                        onChange={(e) => setForm({ ...form, SucursalOrigenId: e.target.value })}
                        fullWidth
                        margin="normal"
                    >
                        {sucursales.map(s => (
                            <MenuItem key={s.id} value={s.id}>{s.Nombre}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Sucursal Destino"
                        value={form.SucursalDestinoId}
                        onChange={(e) => setForm({ ...form, SucursalDestinoId: e.target.value })}
                        fullWidth
                        margin="normal"
                    >
                        {sucursales.map(s => (
                            <MenuItem key={s.id} value={s.id}>{s.Nombre}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label={`Cantidad a transferir (Stock disponible: ${stockDisponible})`}
                        type="number"
                        value={form.Cantidad}
                        onChange={(e) => setForm({ ...form, Cantidad: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setOpenTransfer(false)}>Cancelar</MuiButton>
                    <MuiButton onClick={handleSubmit} variant="contained" color="primary">Confirmar</MuiButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ShowActions;
