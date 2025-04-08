import { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // הייבוא של useNavigate

const API_URL = "http://127.0.0.1:8000/suppliers/login"; // כתובת ה-API שלך

export default function SupplierLogin() {
  const navigate = useNavigate(); // יצירת ה-hook לשימוש בניווט
  const [telephone, setTelephone] = useState(""); // מספר הטלפון
  const [password, setPassword] = useState(""); // הסיסמה
  const [error, setError] = useState(""); // שגיאות
  const [loading, setLoading] = useState(false); // מצב טוען
  const [supplier, setSupplier] = useState(null); // פרטי הספק אחרי ההתחברות

  const handleLogin = async () => {
    setLoading(true);
    setError(""); // מאפס את השגיאה לפני כל נסיון התחברות חדש
    try {
      const response = await axios.post(API_URL, { telephone, password });
      setSupplier(response.data); // שומר את פרטי הספק אם ההתחברות הצליחה
      console.log(response.data);

      // ניווט ל-SupplierMenu לאחר התחברות מוצלחת
      navigate("/supplier-menu");  // הניווט לדף SupplierMenu
    } catch (err) {
      // אם יש שגיאה (כמו סיסמה לא נכונה או ספק לא נמצא)
      setError(err.response ? err.response.data.detail : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ניווט לעמוד ההרשמה
  const navigateToSignup = () => {
    navigate("/supplier-signup");  // כאן תשנה לכתובת של עמוד ההרשמה שלך
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        התחברות לספק
      </Typography>
      <TextField
        label="מספר טלפון"
        variant="outlined"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
        fullWidth
        sx={{ maxWidth: "400px" }}
      />
      <TextField
        label="סיסמה"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        sx={{ maxWidth: "400px" }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={loading}
        sx={{
          width: "200px",
          height: "50px",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "12px",
          marginTop: "20px",
        }}
      >
        {loading ? "טוען..." : "התחבר"}
      </Button>

      {/* קישור לעמוד ההרשמה */}
      <Button
        variant="text"
        onClick={navigateToSignup}
        sx={{
          marginTop: "10px",
          fontSize: "14px",
          fontWeight: "normal",
        }}
      >
        ספק חדש? הירשם כאן
      </Button>

      {supplier && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6">ברוך הבא, {supplier.name}</Typography>
          <Typography variant="body1">מספר טלפון: {supplier.telephone}</Typography>
          <Typography variant="body1">שם חברה: {supplier.nameCompany}</Typography>
        </Box>
      )}
    </Box>
  );
}
