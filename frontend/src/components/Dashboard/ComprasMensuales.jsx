import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const mesesNombres = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ComprasPorMesChart = ({ anio = new Date().getFullYear() }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const response = await fetch(`http://localhost:5000/compras-por-mes?anio=${anio}`);
                const json = await response.json();

                // Mapea los datos con nombres de mes
                const datosFormateados = Array.from({ length: 12 }, (_, i) => {
                    const mes = i + 1;
                    const mesData = json.find(item => item.Mes === mes);
                    return {
                        mes: mesesNombres[i],
                        compras: mesData ? mesData.Compras : 0
                    };
                });

                setData(datosFormateados);
            } catch (error) {
                console.error("Error obteniendo compras por mes:", error);
            }
        };

        fetchCompras();
    }, [anio]);

    return (
        <div style={{ textAlign: 'center', padding: '0.4rem' }}>
            <h3 style={{ textAlign: 'center' }}>Compras por Mes ({anio})</h3>
            <ResponsiveContainer width="100%" height={300} >
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend style={{fontSize: '8px'}} />
                    <Bar dataKey="compras" fill="#8884d8" name="Compras" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ComprasPorMesChart;
