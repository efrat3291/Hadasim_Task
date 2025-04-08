import React from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import Regisetr from "./Register";
import LoginPage from "./LoginPage";
import { useState } from "react";
export default function Auth() {
  const [tab, setTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Box
        sx={{
          width: "400px",
          margin: "auto",
          mt: 5,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          color="primary"
        >
          מערכת ניהול מכולת
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          התחבר או הירשם למערכת
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="כניסה" />
          <Tab label="הרשמה" />
        </Tabs>
        <Box sx={{ mt: 2 }}>{tab === 0 ? <LoginPage /> : <Regisetr />}</Box>
      </Box>
    </>
  );
}
