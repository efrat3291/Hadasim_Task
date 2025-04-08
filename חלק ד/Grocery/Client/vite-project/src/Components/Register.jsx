import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [goods, setGoods] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [newGood, setNewGood] = useState({
    name: "",
    price: 0,
    min_amount: 0,
  });

  const [formData, setFormData] = useState({
    company_name: "",
    telephone: "",
    representative: "",
    password: "",
  });

  const addGood = () => {
    if (newGood.name && newGood.price && newGood.min_amount) {
      setGoods([...goods, newGood]);
      setNewGood({ name: "", price: 0, min_amount: 0 });
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.company_name ||
      !formData.telephone ||
      !formData.representative ||
      !formData.password
    ) {
      alert("יש למלא את כל הפרטים");
      return;
    }

    try {
      const fullData = {
        ...formData,
        goods: goods.map((g) => ({
          name: g.name,
          price: Number(g.price),
          min_amount: Number(g.min_amount),
        })),
      };

      await axios.post("http://127.0.0.1:8000/suppliers/signup", fullData);

      navigate("/supplier-menu");
    } catch (error) {
      alert("הרשמה נכשלה. אנא בדוק את הנתונים ונסה שוב.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        p: 3,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box
        component="form"
        sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="שם חברה"
          fullWidth
          value={formData.company_name}
          onChange={(e) =>
            setFormData({ ...formData, company_name: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="מספר טלפון"
          type="tel"
          fullWidth
          value={formData.telephone}
          onChange={(e) =>
            setFormData({ ...formData, telephone: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="שם ספק"
          fullWidth
          value={formData.representative}
          onChange={(e) =>
            setFormData({ ...formData, representative: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="סיסמה"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="h6">הוספת סחורה</Typography>
        <TextField
          label="שם המוצר"
          fullWidth
          value={newGood.name}
          onChange={(e) =>
            setNewGood({ ...newGood, name: e.target.value })
          }
        />
        <TextField
          label="מחיר לפריט"
          type="number"
          fullWidth
          value={newGood.price}
          onChange={(e) =>
            setNewGood({ ...newGood, price: e.target.value })
          }
        />
        <TextField
          label="כמות מינימלית לרכישה"
          type="number"
          fullWidth
          value={newGood.min_amount}
          onChange={(e) =>
            setNewGood({ ...newGood, min_amount: e.target.value })
          }
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={addGood}
          startIcon={<AddIcon />}
        >
          הוסף מוצר
        </Button>
        <Box>
          {goods.map((good, index) => (
            <Typography key={index} variant="body1">
              {`${good.name} - מחיר: ${good.price} ש"ח, כמות מינימלית: ${good.min_amount}`}
            </Typography>
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          הרשמה
        </Button>
      </Box>
    </Container>
  );
}
