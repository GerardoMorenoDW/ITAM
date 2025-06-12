import './App.css';
//import React, { useState } from 'react';
import { Admin, Resource } from "react-admin";
//import simpleRestProvider from "ra-data-simple-rest";
//import FormularioEquipos from './components/FormularioEquipos';
import ActivosCreate from './components/ActivoCreate';
import UpdateActivo from './components/UpdateActivo'
import Dashboard from "./components/Dashboard";
import ActivosList from './components/ActivosList'
import AsignarSerie from './components/AsignarSerie';
import ActivosFisicosList from './components/ActivosFisicos'
import { provider } from './dataProvider';
import ActivosDetail from './components/DetalleActivo'
import authProvider from './components/authProvider';
//import {Modal} from './components/Modal'



//const dataProvider = simpleRestProvider("http://localhost:5000");


function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>

      <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={provider}>
        <Resource name="activos" list={ActivosList} create={ActivosCreate} edit={UpdateActivo} show={ActivosDetail}  />
        <Resource name="activos-fisicos" list={ActivosFisicosList} edit={AsignarSerie}/>
      </Admin>
    </div>
  );
}

export default App;
