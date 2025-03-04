import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Pagination, Box, IconButton, Button
} from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [revenueFilter, setRevenueFilter] = useState("");
  const [employeesFilter, setEmployeesFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("name");
  const [editingCompany, setEditingCompany] = useState(null); // Track which company is being edited
  const [formData, setFormData] = useState({
    name: "",
    revenue: "",
    profit: "",
    employees: "",
    country: "",
  }); // Form data for editing company

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    axios.get("http://127.0.0.1:8000/api/get-companies/")
      .then(response => setCompanies(response.data || []))
      .catch(error => console.error("Error fetching companies", error));
  };

  const handleDelete = async (id) => {
    try {
      console.log("Deleting company with ID:", id);
      await axios.delete(`http://127.0.0.1:8000/api/delete-company/${id}/`);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company", error);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company.id);
    setFormData({
      name: company.name,
      revenue: company.revenue,
      profit: company.profit,
      employees: company.employees,
      country: company.country
    });
  };

  const handleUpdate = async () => {
    try {
      console.log("Updating company with ID:", editingCompany);
      await axios.put(`http://127.0.0.1:8000/api/update-company/${editingCompany}/`, formData);
      setEditingCompany(null);
      fetchCompanies();
    } catch (error) {
      console.error("Error updating company", error);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const nameMatch = company?.name?.toLowerCase().includes(search.toLowerCase());
    const countryMatch = company?.country?.toLowerCase().includes(search.toLowerCase());
    const revenueMatch = revenueFilter ? company?.revenue >= Number(revenueFilter) : true;
    const employeesMatch = employeesFilter ? company?.employees >= Number(employeesFilter) : true;

    return (nameMatch || countryMatch) && revenueMatch && employeesMatch;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue == null || bValue == null) return 0;

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const itemsPerPage = 5;
  const pageCount = Math.ceil(sortedCompanies.length / itemsPerPage);
  const paginatedCompanies = sortedCompanies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleChangePage = (event, value) => setPage(value);

  const handleSort = (column) => {
    setSortColumn(column);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Company Data</Typography>

      {/* Search & Filter Inputs */}
      <Box display="flex" gap={2} marginBottom={2}>
        <TextField
          label="Search Companies"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <TextField
          label="Min Revenue"
          variant="outlined"
          type="number"
          onChange={(e) => setRevenueFilter(e.target.value)}
          value={revenueFilter}
        />
        <TextField
          label="Min Employees"
          variant="outlined"
          type="number"
          onChange={(e) => setEmployeesFilter(e.target.value)}
          value={employeesFilter}
        />
      </Box>

      {/* Company Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton onClick={() => handleSort("name")}>
                  <Typography><b>Company Name</b></Typography>
                  {sortColumn === "name" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleSort("revenue")}>
                  <Typography><b>Revenue ($)</b></Typography>
                  {sortColumn === "revenue" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleSort("profit")}>
                  <Typography><b>Profit ($)</b></Typography>
                  {sortColumn === "profit" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleSort("employees")}>
                  <Typography><b>Employees</b></Typography>
                  {sortColumn === "employees" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleSort("country")}>
                  <Typography><b>Country</b></Typography>
                  {sortColumn === "country" && (sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                </IconButton>
              </TableCell>
              <TableCell>
                  <Typography><b>Actions</b></Typography>  
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company?.name || "N/A"}</TableCell>
                  <TableCell>{company?.revenue?.toLocaleString() || "N/A"}</TableCell>
                  <TableCell>{company?.profit?.toLocaleString() || "N/A"}</TableCell>
                  <TableCell>{company?.employees?.toLocaleString() || "N/A"}</TableCell>
                  <TableCell>{company?.country || "N/A"}</TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleDelete(company.id)}>Delete</Button>
                    <Button color="primary" onClick={() => handleEdit(company)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Form */}
      {editingCompany && (
        <div>
          <h3>Edit Company</h3>
          <TextField label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="Revenue" value={formData.revenue} onChange={(e) => setFormData({ ...formData, revenue: e.target.value })} />
          <TextField label="Profit" value={formData.profit} onChange={(e) => setFormData({ ...formData, profit: e.target.value })} />
          <TextField label="Employees" value={formData.employees} onChange={(e) => setFormData({ ...formData, employees: e.target.value })} />
          <TextField label="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
          <Button onClick={handleUpdate}>Update</Button>
        </div>
      )}

      {/* Pagination Controls */}
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          color="primary"
          sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
        />
      )}
    </div>
  );
};

export default CompanyList;
