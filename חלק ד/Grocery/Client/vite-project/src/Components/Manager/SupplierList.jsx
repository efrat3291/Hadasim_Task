import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../Features/UserSlice";
import GoodsList from "./GoodsList";

export default function SupplierList() {
  const dispatch = useDispatch();
  const allSuppliers = useSelector((state) => state.users.users);
  const error = useSelector((state) => state.users.error);
  const status = useSelector((state) => state.users.status);
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState(null);

  
  useEffect(() => {
    if (allSuppliers.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, allSuppliers.length]);

 
  const suppliers = allSuppliers.filter((x) => x.role !== "manager");

  const handleShowGoods = (index) => {
    setSelectedSupplierIndex(index);
  };

  const handleBack = () => {
    setSelectedSupplierIndex(null);
  };

  if (status === "loading") {
    return <div>טעינה...</div>;
  }

  if (status === "failed") {
    return <div>שגיאה בטעינת הנתונים: {error}</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>
      <TableContainer sx={{ maxWidth: 800 }}>
        <Table>
          <TableBody>
            {/* אם לא נבחר ספק - מציגים את הרשימה */}
            {selectedSupplierIndex === null &&
              suppliers.map((supplier, index) => (
                <TableRow key={supplier.id}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      textAlign: "center",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    ספק: {supplier.name} - שם {supplier.nameCompany}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => handleShowGoods(index)}
                    >
                      הצג
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            {/* אם נבחר ספק - מציגים את הסחורות שלו */}
            {selectedSupplierIndex !== null && (
              <GoodsTable
                supplier={suppliers[selectedSupplierIndex]}
                onBack={handleBack}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
