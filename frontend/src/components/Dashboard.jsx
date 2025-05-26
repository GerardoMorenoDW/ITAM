import { Card, CardContent, Typography } from "@mui/material";
import DashboardPastel from "./Dashboard/EstadosActivos";
import ComprasPorMesChart from "./Dashboard/ComprasMensuales";

const Dashboard = () => (
  <Card>
    <CardContent>
      <Typography variant="h5">Bienvenido al Dashboard</Typography>
      <Typography variant="body1">Aquí puedes visualizar estadísticas.</Typography>
    </CardContent>
    <div>
      <DashboardPastel />
    </div>
    <div>
      <ComprasPorMesChart anio={2025} />
    </div>
  </Card>
);

export default Dashboard;
