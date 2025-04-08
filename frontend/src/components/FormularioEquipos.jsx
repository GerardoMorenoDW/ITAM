import { useState } from 'react';

export default function FormularioEquipos() {
  const [formData, setFormData] = useState({
    Nombre: '',
    Marca: '',
    Modelo: '',
    NumeroSerie: '',
    Ubicacion: '',
    Departamento: '',
    UsuarioAsignado: '',
    FechaAdquisicion: '',
    Proveedor: '',
    Costo: '',
    Observaciones: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/activo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Equipo registrado exitosamente');
        setFormData({
          Nombre: '',
          Marca: '',
          Modelo: '',
          NumeroSerie: '',
          Ubicacion: '',
          Departamento: '',
          UsuarioAsignado: '',
          FechaAdquisicion: '',
          Proveedor: '',
          Costo: '',
          Observaciones: ''
        });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '500px' }}>
      {Object.keys(formData).map((field) => (
        <input
          key={field}
          type={field === 'FechaAdquisicion' ? 'date' : field === 'Costo' ? 'number' : 'text'}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          placeholder={field}
          required={field !== 'Observaciones'}
        />
      ))}
      <button type="submit">Registrar Equipo</button>
    </form>
  );
}
