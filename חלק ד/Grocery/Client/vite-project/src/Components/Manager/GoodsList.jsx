import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createOrder } from "../Features/OrderSlice";
import { createGoodInOrder } from "../Features/GoodsInOrderSlice";

export default function GoodsTable({ supplier, onBack }) {
  const dis = useDispatch();
  const [goods, setGoods] = useState(
    supplier.goods.map((good) => ({
      ...good,
      orderQuantity: good.orderQuantity || 0, // Ensure orderQuantity is initialized
    }))
  );

  const order = { idSuplier: supplier.id, status: "הוזמן" };

  const handleQuantityChange = (goodIndex, value) => {
    const updatedGoods = [...goods];
    updatedGoods[goodIndex].orderQuantity = value;
    setGoods(updatedGoods);

    const updatedOrderDetails = updatedGoods
      .filter((good) => good.orderQuantity > 0)
      .map((good) => ({
        Name: good.nameProduct,
        Quantity: Number(good.orderQuantity),
        GoodsId: good.id,
        Goods: good,
      }));

  };

  const handleGroupOrder = async () => {
    const data = await dis(createOrder(order)).unwrap();
    const orderedGoods = goods.filter(
      (good) => good.orderQuantity >= good.minimumPurchaseQuantity
    );

    if (orderedGoods.length === 0) {
      alert("לא נבחרו סחורות מתאימות להזמנה.");
      return;
    }
    orderedGoods.map((good) => {
      dis(
        createGoodToOrder({
          name: good.nameProduct,
          quantity: good.orderQuantity,
          goodsId: good.id,

          orderId: data.id,
        })
      );
    });
    const summary = orderedGoods
      .map((good) => `${good.orderQuantity} יחידות של ${good.nameProduct}`)
      .join("\n");

    alert(`בוצעה הזמנה לספק ${supplier.nameCompany}:\n${summary}`);
  };

  const hasValidOrders = goods.some(
    (good) => good.orderQuantity >= good.minimumPurchaseQuantity
  );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h3>
        ספק: {supplier.name} - שם חברה: {supplier.nameCompany}
      </h3>
      <TableContainer sx={{ maxWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>שם סחורה</TableCell>
              <TableCell>כמות מינימלית</TableCell>
              <TableCell>עלות</TableCell>
              <TableCell>כמות להזמנה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goods.map((good, goodIndex) => {
              const isInvalid =
                good.orderQuantity || 0 < good.minimumPurchaseQuantity;

              return (
                <TableRow key={good.id}>
                  <TableCell>{good.nameProduct}</TableCell>
                  <TableCell>{good.minimumPurchaseQuantity}</TableCell>
                  <TableCell>{good.cost} ₪</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={good.orderQuantity || ""}
                      onChange={(e) =>
                        handleQuantityChange(goodIndex, e.target.value)
                      }
                      inputProps={{ min: 0 }}
                      sx={{ width: "100px", backgroundColor: "#ffffff" }}
                      error={isInvalid}
                      helperText={
                        isInvalid ? `לפחות ${good.minimumPurchaseQuantity}` : ""
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGroupOrder}
          disabled={!hasValidOrders}
          sx={{ marginRight: "10px" }}
        >
          הזמן
        </Button>
        <Button variant="outlined" color="secondary" onClick={onBack}>
          חזור
        </Button>
      </div>
    </div>
  );
}
