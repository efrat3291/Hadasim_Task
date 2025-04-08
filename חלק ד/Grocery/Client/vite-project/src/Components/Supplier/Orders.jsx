import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { fetchOrdersBySupplier, updateOrder } from "../Features/OrderSlice";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

export default function Orders({ onBack }) {
  const currentUserIdSuplier = useSelector(
    (state) => state.login.currentUser?.Id
  
  );
  const dispatch = useDispatch();
  const ordersList = useSelector((state) => state.orders.orders).filter(
    (order) => order.idSuplier == currentUserIdSuplier
  );

  const [filteredGoods, setFilteredGoods] = useState(ordersList);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if(currentUserIdSuplier)
    dispatch(fetchOrdersBySupplier(currentUserIdSuplier)); // הוספת ה-ID של הספק
  }, [dispatch, currentUserIdSuplier]);

  useEffect(() => {
    const filtered =
      selectedStatus === "all"
        ? ordersList
        : ordersList.filter((order) => order.status === selectedStatus);

    if (JSON.stringify(filtered) !== JSON.stringify(filteredGoods)) {
      setFilteredGoods(filtered);
    }
  }, [selectedStatus, ordersList]);

  const handleStatusChange = (index) => {
    const updatedGoods = [...filteredGoods];
    if (updatedGoods[index].status === "הוזמן") {
      updatedGoods[index].status = "בהמתנה";
      setFilteredGoods(updatedGoods);
      dispatch(updateOrder(updatedGoods[index].id));
    }
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      מאושר: <CheckCircleIcon color="success" />,
      בהמתנה: <HourglassEmptyIcon color="warning" />,
      הוזמן: <LocalShippingIcon color="info" />,
    };
    return statusIcons[status] || null;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <p>ההזמנות שלי</p>

      <div>
        <IconButton
          onClick={() => handleFilterChange("מאושר")}
          color={selectedStatus === "מאושר" ? "success" : "default"}
        >
          <CheckCircleIcon />
        </IconButton>
        <IconButton
          onClick={() => handleFilterChange("בהמתנה")}
          color={selectedStatus === "בהמתנה" ? "warning" : "default"}
        >
          <HourglassEmptyIcon />
        </IconButton>
        <IconButton
          onClick={() => handleFilterChange("הוזמן")}
          color={selectedStatus === "הוזמן" ? "info" : "default"}
        >
          <LocalShippingIcon />
        </IconButton>
        <Button
          variant="outlined"
          onClick={() => handleFilterChange("all")}
          sx={{
            marginLeft: 2,
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "0.3s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          הצג הכל
        </Button>
      </div>

      <TableContainer sx={{ maxWidth: "600px", marginTop: 4 }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: "8px", fontSize: "14px" }}>
                הפריטים שהוזמנו:
              </TableCell>
              <TableCell sx={{ padding: "8px", fontSize: "14px" }}>ספק</TableCell>
              <TableCell sx={{ padding: "8px", fontSize: "14px" }}>סטטוס</TableCell>
              <TableCell sx={{ padding: "8px", fontSize: "14px" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGoods.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ padding: "8px", fontSize: "12px" }}>
                  {item.goodsToOrder.map((good, idx) => (
                    <span key={idx}>
                      {good?.name}-{good?.quantity}{" "}
                    </span>
                  ))}
                </TableCell>
                <TableCell sx={{ padding: "8px", fontSize: "12px" }}>
                  {item.idSuplier}
                </TableCell>
                <TableCell sx={{ padding: "8px", fontSize: "12px" }}>
                  {item.status}
                </TableCell>
                <TableCell sx={{ padding: "8px" }}>
                  <IconButton
                    onClick={() => handleStatusChange(index)}
                    disabled={item.status !== "הוזמן"}
                  >
                    {getStatusIcon(item.status)}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        onClick={onBack}
        sx={{
          width: "200px",
          height: "50px",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "12px",
          transition: "0.3s",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        חזור
      </Button>
    </div>
  );
}
