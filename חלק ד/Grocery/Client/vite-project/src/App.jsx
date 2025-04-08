import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Components/Store/store';
import ManagerMenu from './Components/Manager/ManagerMenu';
import SupplierMenu from './Components/Supplier/SupplierMenu';
import OrdersList from './Components/Manager/OrdersList';
import Orders from './Components/Supplier/Orders';
// import AddOrder from './Components/AddOrder';
// import ManageGoods from './Components/ManageGoods';
 import Login from './Components/Login';
 import Enterance from './Components/Enterance'
import Register from './Components/Register';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path="/" element={<Enterance />} />
          <Route path="/login" element={<Login />} />
          <Route path="/supplier-signup" element={<Register />} />
          <Route path="/manager-dashboard" element={<ManagerMenu />} />
          <Route path="/supplier-menu" element={<SupplierMenu />} />
          {/* <Route path="/add-order" element={<AddOrder />} /> */}
          <Route path="/manager-orders" element={<OrdersList />} />
          <Route path="/supplier-orders" element={<Orders />} />
          {/* <Route path="/manage-goods" element={<ManageGoods />} />  */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
