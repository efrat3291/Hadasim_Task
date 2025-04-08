import { useState, useEffect } from "react"; 
import { TextField, Box, Button, Typography, CircularProgress, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import NavBar from "../NavBar";
import OrdersList from "./OrdersList";
import SupplierList from "./SupplierList";
import axios from "axios"; 

const API_URL_ORDERS = "http://127.0.0.1:8000/orders/"; 
const API_URL_GOODS = "http://127.0.0.1:8000/goods/"; 

export default function ManagerMenu() {
  const [view, setView] = useState("main");
  const [orders, setOrders] = useState([]); 
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [selectedGood, setSelectedGood] = useState(null); 
  const [quantity, setQuantity] = useState(1); 

  // פונקציה לשליפת הזמנות מהשרת
  const fetchOrders = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(API_URL_ORDERS); 
      setOrders(response.data); 
    } catch (err) {
      setError("שגיאה בטעינת ההזמנות"); 
    } finally {
      setLoading(false); 
    }
  };

  // פונקציה לשליפת סחורות מהשרת
  const fetchGoods = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(API_URL_GOODS); 
      setGoods(response.data); 
    } catch (err) {
      setError("שגיאה בטעינת הסחורות"); 
    } finally {
      setLoading(false); 
    }
  };

  
  const handleViewOrders = () => {
    setView("OrdersList"); 
    fetchOrders(); 
  };


  const handleViewGoods = () => {
    setView("SupplierList");
    fetchGoods(); 
  };


  const handleOrderGood = async () => {
    if (!selectedGood || quantity <= 0) {
      alert("אנא בחר סחורה וכמות");
      return;
    }

    try {
      const orderData = {
        supplier_id: selectedGood.supplier_id, 
        goods_in_order: [
          {
            goods_id: selectedGood.id,
            price: selectedGood.price,
            amount: parseInt(quantity),
          },
        ],
        status: "בהמתנה",
      };

      const response = await axios.post("http://127.0.0.1:8000/orders/post", orderData);
      alert("ההזמנה בוצעה בהצלחה!");
      setSelectedGood(null);
      setQuantity(1); // איפוס הכמות
    } catch (err) {
      console.error("שגיאה בהזמנת הסחורה:", err.response?.data || err.message);
      setError("שגיאה בהזמנת הסחורה");
    }
  };

  return (
    <>
      <NavBar name={" בעל המכולת"} />
      {view === "OrdersList" && (
        <OrdersList
          orders={orders}
          loading={loading}
          error={error}
          onBack={() => setView("main")}
        />
      )}
      {view === "SupplierList" && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            הזמנת סחורה
          </Typography>
          {/* תצוגת סחורות */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>בחר סחורה</InputLabel>
            <Select
              value={selectedGood || ""}
              onChange={(e) => setSelectedGood(e.target.value)}
              label="בחר סחורה"
            >
              {goods.map((good) => (
                <MenuItem key={good.id} value={good}>
                  {good.name} - {good.price} ש"ח (ספק: {good.supplier_name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* שדה להזנת כמות */}
          <TextField
            label="כמות"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOrderGood}
            sx={{ width: "200px", height: "50px", fontSize: "16px" }}
          >
            הזמן סחורה
          </Button>
          <Button
            variant="outlined"
            sx={{ width: "200px", height: "50px", fontSize: "16px", mt: 2 }}
            onClick={() => setView("main")}
          >
            חזרה
          </Button>
        </Box>
      )}
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
            onClick={handleViewOrders} // הפעלת פונקציה לשליפת הזמנות
          >
            צפייה בהזמנות
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
            onClick={handleViewGoods} // הפעלת פונקציה לשליפת סחורות
          >
            הזמנת סחורה
          </Button>
        </Box>
      )}

      {/* הצגת מצב טעינה */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* הצגת שגיאה אם יש */}
      {error && (
        <Snackbar open={true} autoHideDuration={3000}>
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
