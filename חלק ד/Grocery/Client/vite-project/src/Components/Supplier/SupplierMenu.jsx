import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import NavBar from "../NavBar";
import Orders from "./Orders";

export default function SupplierMain() {
  const [view, setView] = useState("main");

  return (
    <>
      <NavBar name={"ספק החברה"} />
      {view === "lastOrders" && <Orders status="מאושר" name="הזמנות קודמות" onBack={() => setView("main")} />}
      {view === "newOrders" && <Orders status="בהמתנה" name="הזמנות בתהליך" onBack={() => setView("main")} />}
      {view === "main" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            gap: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            ניהול הזמנות
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: "300px",
              height: "80px",
              fontSize: "20px",
              fontWeight: "bold",
              borderRadius: "12px",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={() => setView("lastOrders")}
          >
            צפייה בהזמנות קודמות
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: "300px",
              height: "80px",
              fontSize: "20px",
              fontWeight: "bold",
              borderRadius: "12px",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={() => setView("newOrders")}
          >
            הזמנות בהמתנה
          </Button>
        </Box>
      )}
    </>
  );
}
