import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";

const Charts = () => {
  const [chartType, setChartType] = useState("bar");
  const [minRevenue, setMinRevenue] = useState("");
  const [minEmployees, setMinEmployees] = useState("");
  const [chartSrc, setChartSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/generate-chart/${chartType}/?min_revenue=${minRevenue}&min_employees=${minEmployees}`
      );
      setChartSrc(`data:image/png;base64,${response.data.chart}`);
    } catch (error) {
      setError("Error fetching chart. Please try again later.");
      console.error("Error fetching chart", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h6">Generate Chart</Typography>
      <Box display="flex" flexDirection="column" gap={2} marginBottom={2}>
        <TextField
          label="Min Revenue"
          type="number"
          value={minRevenue}
          onChange={(e) => setMinRevenue(e.target.value)}
          fullWidth
        />
        <TextField
          label="Min Employees"
          type="number"
          value={minEmployees}
          onChange={(e) => setMinEmployees(e.target.value)}
          fullWidth
        />
      </Box>

      <Box display="flex" gap={2} marginBottom={2}>
        <Button variant="contained" onClick={() => setChartType("bar")}>
          Bar Chart
        </Button>
        <Button variant="contained" onClick={() => setChartType("pie")}>
          Pie Chart
        </Button>
        <Button variant="contained" onClick={() => setChartType("scatter")}>
          Scatter Chart
        </Button>
      </Box>

      <Button
        variant="contained"
        onClick={fetchChart}
        disabled={loading}
        sx={{ marginBottom: 2 }}
      >
        {loading ? "Loading..." : "Generate Chart"}
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      {chartSrc && <img src={chartSrc} alt="Generated Chart" />}
    </div>
  );
};

export default Charts;
