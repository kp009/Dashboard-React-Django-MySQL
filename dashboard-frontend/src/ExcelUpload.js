import React, { useState } from "react";
import axios from "axios";
import { Button, Typography } from "@mui/material";

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file before uploading.");
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload-excel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("File upload failed.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h6">Upload Excel File</Typography>

      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileChange} 
        style={{ display: "none" }} 
        id="fileInput"
      />

      {/* Button to trigger file selection */}
      <label htmlFor="fileInput">
        <Button variant="contained" component="span">
          Select File
        </Button>
      </label>

      {/* Button to trigger upload */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleFileUpload} 
        style={{ marginLeft: "10px" }}
        disabled={!file}  // Disable if no file selected
      >
        Upload File
      </Button>

      <p>{message}</p>
    </div>
  );
};

export default ExcelUpload;
