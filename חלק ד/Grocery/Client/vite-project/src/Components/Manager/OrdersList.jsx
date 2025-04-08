import { useState, useEffect } from "react";
import {
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, CircularProgress
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import UpdateIcon from "@mui/icons-material/Update"; 
import { fetchOrders, updateOrder } from "../Features/OrderSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function OrdersList({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const ordersList = useSelector((state) => state.orders.orders);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await dispatch(fetchOrders()).unwrap();
        console.log(response);
      } catch (err) {
        setError("שגיאה בטעינת ההזמנות");
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, [dispatch]);

  const [filteredGoods, setFilteredGoods] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    setFilteredGoods(ordersList || []);
  }, [ordersList]);

  const handleStatusChange = async (orderId) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/confirm-received/${orderId}`);
      
      if (response.status === 200) {
        alert('הסטטוס עודכן בהצלחה');
      }
    } catch (error) {
      console.error('שגיאה בעדכון הסטטוס:', error);
      alert('הייתה שגיאה בעדכון הסטטוס');
    }
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    if (status === "all") {
      setFilteredGoods(ordersList);
    } else {
      const filtered = ordersList.filter((item) => item.status === status);
      setFilteredGoods(filtered);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "מאושר": return <CheckCircleIcon color="success" />;
      case "בהמתנה": return <HourglassEmptyIcon color="warning" />;
      case "הוזמן": return <LocalShippingIcon color="info" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", justifyContent: "center",
      alignItems: "center", flexDirection: "column", height: "100vh"
    }}>
      <p>ההזמנות שלי</p>

      <div>
        <IconButton onClick={() => handleFilterChange("מאושר")} color={selectedStatus === "מאושר" ? "success" : "default"}>
          <CheckCircleIcon />
        </IconButton>
        <IconButton onClick={() => handleFilterChange("בהמתנה")} color={selectedStatus === "בהמתנה" ? "warning" : "default"}>
          <HourglassEmptyIcon />
        </IconButton>
        <IconButton onClick={() => handleFilterChange("הוזמן")} color={selectedStatus === "הוזמן" ? "info" : "default"}>
          <LocalShippingIcon />
        </IconButton>
        <Button variant="outlined" onClick={() => handleFilterChange("all")}>
          הצג הכל
        </Button>
      </div>

      <TableContainer sx={{ maxWidth: "600px", marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>הפריטים שהוזמנו:</TableCell>
              <TableCell>ספק</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGoods.length > 0 ? (
              filteredGoods.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.goods_in_order.length > 0 ? (
                      item.goods_in_order.map((good, idx) => (
                        <span key={idx}>{good?.name}  {good?.amount}</span>
                      ))
                    ) : (
                      <span>אין פריטים בהזמנה</span>
                    )}
                  </TableCell>
                  <TableCell>{item.supplierName || "לא צויין ספק"}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleStatusChange(item.id)} disabled={item.status !== "בהמתנה" && item.status !== "בתהליך"}>
                      {getStatusIcon(item.status)}
                    </IconButton>
                    {item.status === "בתהליך" && (
                      <Button onClick={() => handleStatusChange(item.id)} color="primary">
                        <UpdateIcon />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">אין נתונים להציג</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={onBack} sx={{ mt: 2 }}>
        חזור
      </Button>

      {error && <div style={{ color: "red", marginTop: "20px" }}>{error}</div>}
    </div>
  );
}
