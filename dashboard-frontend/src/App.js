
import './App.css';
import React from "react";
import ExcelUpload from "./ExcelUpload";
import CompanyList from "./CompanyList";
import AddCompany from './AddCompany';
import Charts from './Charts';
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography variant="h4" align="center">Dashboard</Typography>
      <ExcelUpload />
      <AddCompany />
      <CompanyList />
      <Charts />
    </Container>
    
  );
}

export default App;
