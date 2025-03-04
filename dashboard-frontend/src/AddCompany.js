import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";

const AddCompany = () => {
  const [company, setCompany] = useState({
    name: "",
    revenue: "",
    profit: "",
    employees: "",
    country: "",
  });

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/add-company/", company);
      alert("Company added successfully!");
    } catch (error) {
      alert("Error adding company");
    }
  };

  return (
    <div>
      <Typography variant="h6">Add a New Company</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" onChange={handleChange} required />
        <TextField label="Revenue" name="revenue" type="number" onChange={handleChange} required />
        <TextField label="Profit" name="profit" type="number" onChange={handleChange} required />
        <TextField label="Employees" name="employees" type="number" onChange={handleChange} required />
        <TextField label="Country" name="country" onChange={handleChange} required />
        <Button type="submit" variant="contained" color="primary">
          Add Company
        </Button>
      </form>
    </div>
  );
};

export default AddCompany;
