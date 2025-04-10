import './App.css';
import React, { useState } from 'react';
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
//import FormularioEquipos from './components/FormularioEquipos';
import Dashboard from "./components/Dashboard";
import ActivosList from './components/ActivosList'
//import { provider } from './dataProvider';
//import {Modal} from './components/Modal'



const dataProvider = simpleRestProvider("http://localhost:5000");


function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>

      <Admin dashboard={Dashboard} dataProvider={dataProvider}>
        <Resource name="activos" list={ActivosList} />
      </Admin>
    </div>
  );
}

export default App;
