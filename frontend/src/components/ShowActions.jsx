// ShowActions.js
import {
    TopToolbar,
    useRecordContext,
    useRedirect,
  } from "react-admin";
  import {
    Button as MuiButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@mui/material";
  import { useState } from "react";
  
  const ShowActions = () => {
    const record = useRecordContext();
    const [openTransfer, setOpenTransfer] = useState(false);
    const [openAjuste, setOpenAjuste] = useState(false);
    const redirect = useRedirect();
  
    if (!record) return null;
  
    return (
      <>
        <TopToolbar>
          <MuiButton onClick={() => setOpenTransfer(true)} variant="outlined">
            Transferir
          </MuiButton>
          <MuiButton onClick={() => setOpenAjuste(true)} variant="outlined">
            Ajuste de inventario
          </MuiButton>
        </TopToolbar>
  
        {/* Modal Transferencia */}
        <Dialog open={openTransfer} onClose={() => setOpenTransfer(false)}>
          <DialogTitle>Transferencia</DialogTitle>
          <DialogContent>
            Aquí va tu lógica para transferir el activo con ID <b>{record.id}</b>.
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setOpenTransfer(false)}>Cancelar</MuiButton>
            <MuiButton onClick={() => {
              // tu lógica aquí
              setOpenTransfer(false);
            }}>Confirmar</MuiButton>
          </DialogActions>
        </Dialog>
  
        {/* Modal Ajuste */}
        <Dialog open={openAjuste} onClose={() => setOpenAjuste(false)}>
          <DialogTitle>Ajuste de Inventario</DialogTitle>
          <DialogContent>
            Aquí va la lógica para hacer un ajuste del activo <b>{record.id}</b>.
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setOpenAjuste(false)}>Cancelar</MuiButton>
            <MuiButton onClick={() => {
              // tu lógica aquí
              setOpenAjuste(false);
            }}>Guardar</MuiButton>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  export default ShowActions;
  