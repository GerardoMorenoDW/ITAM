import './App.css';
//import React, { useState } from 'react';
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
//import FormularioEquipos from './components/FormularioEquipos';
import ActivosCreate from './components/ActivoCreate';
import UpdateActivo from './components/UpdateActivo'
import Dashboard from "./components/Dashboard";
import ActivosList from './components/ActivosList'
import { provider } from './dataProvider';
//import {Modal} from './components/Modal'



//const dataProvider = simpleRestProvider("http://localhost:5000");


function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>

      <Admin dashboard={Dashboard} dataProvider={provider}>
        <Resource name="activos" list={ActivosList} create={ActivosCreate} edit={UpdateActivo} />
      </Admin>
    </div>
  );
}

export default App;
