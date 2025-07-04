import { Card, CardContent, Typography, Box, Grid2 } from "@mui/material";
import DashboardPastel from "./Dashboard/EstadosActivos";
import ComprasPorMesChart from "./Dashboard/ComprasMensuales";
import { Resource } from "react-admin";
import AsignarSerie from "./AsignarSerie";
import ActivosListExp from "./Dashboard/ProximosExpirar";

const Dashboard = () => {
  return(
  <Box sx={{ padding: 4 }} title="Dashboard ITAM">
    <Typography variant="h4" gutterBottom>
      Bienvenido al Dashboard
    </Typography>
    <Typography variant="body1" gutterBottom>
      Aquí puedes visualizar estadísticas.
    </Typography>

    <Grid2 container spacing={4}>
      <Grid2 item xs={12} md={6} size={12}>
        <Card>
          <CardContent>
            <ComprasPorMesChart anio={2025} />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} md={6} size={4}>
        <Card>
          <CardContent>
            <DashboardPastel />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 item xs={12} md={6} size={8}>
        <Card>
          <CardContent>
            <Resource name="activos-fisicos-expiracion" list={ActivosListExp} show={AsignarSerie} />
          </CardContent>
        </Card>
      </Grid2>

    </Grid2>
  </Box>
)};

export default Dashboard;
