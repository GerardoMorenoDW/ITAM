import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
}) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const DashboardPastel = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await fetch("http://localhost:5000/activos-fisicos-estados");
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error("Error obteniendo activos por estado:", error);
            }
        };

        fetchEstados();
    }, []);

    if (!data || data.length === 0) {
        return <div>No hay datos disponibles.</div>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h3>Distribución de Activos por Estado</h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="cantidad"
                        nameKey="Estado"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );

};

export default DashboardPastel;
