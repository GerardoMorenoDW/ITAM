import {
    Show,
    TabbedShowLayout,
    useRecordContext,
} from "react-admin";
import { Grid2, Typography, Paper, Box, useTheme } from "@mui/material";

import DisponibilidadTable from "./DisponibilidadActivo";
import MovimientosActivos from "./MovimientosActivos";
import ShowActions from "./ShowActions";

const DescripcionTab = () => {
    const record = useRecordContext();
    const theme = useTheme();
    if (!record) return null;

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        >
            <Grid2 container spacing={4}>
                {/* Columna izquierda */}
                <Grid2 item xs={12} sm={6}>
                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            ID del Producto
                        </Typography>
                        <Typography variant="body1">{record.id}</Typography>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Modelo
                        </Typography>
                        <Typography variant="body1">{record.Modelo}</Typography>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Departamento
                        </Typography>
                        <Typography variant="body1">{record.Departamento}</Typography>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Costo
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: theme.palette.success.main }}
                        >
                            ${record.Costo}
                        </Typography>
                    </Box>
                </Grid2>

                {/* Columna derecha */}
                <Grid2 item xs={12} sm={6}>
                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Nombre
                        </Typography>
                        <Typography variant="body1">{record.Nombre}</Typography>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Tipo
                        </Typography>
                        <Typography variant="body1">{record.Tipo}</Typography>
                    </Box>

                    <Box mb={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Proveedor
                        </Typography>
                        <Typography variant="body1" color="primary">
                            {record.Proveedor}
                        </Typography>
                    </Box>
                </Grid2>

                {/* Observaciones en ambas columnas */}
                <Grid2 item xs={12}>
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Observaciones
                        </Typography>
                        <Typography variant="body1">{record.Observaciones}</Typography>
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};



const ActivosDetail = () => (
    <Show title="Detalles Del Activo" actions={<ShowActions />}>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Descripción">
                <DescripcionTab />
            </TabbedShowLayout.Tab>

            <TabbedShowLayout.Tab label="Disponibilidad">
                <Typography variant="h6" gutterBottom>
                    Disponibilidad en sucursales
                </Typography>
                <DisponibilidadTable />
            </TabbedShowLayout.Tab>

            <TabbedShowLayout.Tab label="Movimientos">
                <Typography variant="h6" gutterBottom>
                    Movimientos del activo
                </Typography>
                <MovimientosActivos />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Show>
);

export default ActivosDetail;
