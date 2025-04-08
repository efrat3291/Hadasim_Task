import { useState, useEffect } from "react"; // ייבוא useEffect לשליפת נתונים
import { TextField, Box, Button, Typography, CircularProgress, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import NavBar from "../NavBar";
import OrdersList from "./OrdersList";
import SupplierList from "./SupplierList";
import axios from "axios"; // ייבוא axios לשליחת בקשות

const API_URL_ORDERS = "http://127.0.0.1:8000/orders/"; // הכתובת של ה-API לשליפת הזמנות
const API_URL_GOODS = "http://127.0.0.1:8000/goods/"; // הכתובת של ה-API לשליפת סחורות

export default function ManagerMenu() {
  const [view, setView] = useState("main");
  const [orders, setOrders] = useState([]); // אחסון ההזמנות
  const [goods, setGoods] = useState([]); // אחסון הסחורות
  const [loading, setLoading] = useState(false); // מצב טעינה
  const [error, setError] = useState(null); // מצב שגיאה
  const [selectedGood, setSelectedGood] = useState(null); // סחורה נבחרת
  const [quantity, setQuantity] = useState(1); // כמות להזמנה

  // פונקציה לשליפת הזמנות מהשרת
  const fetchOrders = async () => {
    setLoading(true); // הפעלת מצב טעינה
    try {
      const response = await axios.get(API_URL_ORDERS); // שליחת בקשה ל-API
      setOrders(response.data); // עדכון ההזמנות שהתקבלו מה-API
    } catch (err) {
      setError("שגיאה בטעינת ההזמנות"); // הצגת שגיאה במידה ויש בעיה
    } finally {
      setLoading(false); // סיום טעינה
    }
  };

  // פונקציה לשליפת סחורות מהשרת
  const fetchGoods = async () => {
    setLoading(true); // הפעלת מצב טעינה
    try {
      const response = await axios.get(API_URL_GOODS); // שליחת בקשה ל-API
      setGoods(response.data); // עדכון הסחורות שהתקבלו מה-API
    } catch (err) {
      setError("שגיאה בטעינת הסחורות"); // הצגת שגיאה במידה ויש בעיה
    } finally {
      setLoading(false); // סיום טעינה
    }
  };

  // פונקציה שתופעל כשנלחץ על כפתור "צפייה בהזמנות"
  const handleViewOrders = () => {
    setView("OrdersList"); // שינוי ה-view להצגת הזמנות
    fetchOrders(); // קריאה לפונקציה לשליפת ההזמנות מה-API
  };

  // פונקציה שתופעל כשנלחץ על כפתור "הזמנת סחורה"
  const handleViewGoods = () => {
    setView("SupplierList");
    fetchGoods(); // קריאה לפונקציה לשליפת הסחורות מה-API
  };

  // פונקציה להזמין סחורה
  const handleOrderGood = async () => {
    if (!selectedGood || quantity <= 0) {
      alert("אנא בחר סחורה וכמות");
      return;
    }

    try {
      const orderData = {
        supplier_id: selectedGood.supplier_id, // נשלף מהאובייקט
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
