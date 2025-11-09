import './App.css'
import Home from './home/home'
import Ocorrencia from './components/relatarOcorrencia/Ocorrencia'
import Consultar from './components/consultarOcorrencias/Consultar'
import { Routes, Route } from "react-router-dom";
import RootLayout from "./RootLayout";

export function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element = {<Home/>}></Route>
          <Route path="/Ocorrencia" element = { <Ocorrencia/> }></Route>
          <Route path="/Consulta" element = {<Consultar/>}></Route>
        </Route>
      </Routes>
    </>
  );
}

