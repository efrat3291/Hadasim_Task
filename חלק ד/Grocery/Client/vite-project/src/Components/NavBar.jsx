import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import { CheckCircle, HourglassEmpty } from "@mui/icons-material";

const NavBar = ({ name }) => {
  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="h6">מערכת לניהול מכולת</Typography>
        </Box>


        <Typography variant="h6" sx={{ flexShrink: 0 }}>
          שלום ל {name}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
