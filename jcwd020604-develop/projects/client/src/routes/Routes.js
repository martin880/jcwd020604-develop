import { Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CollectionPage from "../pages/user/ProductCollectionPage";
import DetailPage from "../pages/user/ProductDetailPage";
import AdminManageDataPage from "../pages/admin/AdminManageDataPage";
import AdminProductPage from "../pages/admin/AdminProductPage";
import Register from "../components/Register";
import Login from "../components/Login";
import Verify from "../components/RegisterVerify";
import UserProfile from "../pages/user/UserProfile";
import UserList from "../pages/user/UserList";
import AdminProfile from "../pages/user/UserProfile";
import AddUser from "../pages/user/AddUser";
import EditUser from "../pages/user/EditUser";
import ResetPassword from "../pages/reset/ResetPassword";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import AdminHistoryPage from "../pages/admin/AdminHistoryPage";
import AdminMutationPage from "../pages/admin/AdminMutationPage";
import ConfirmResetPassword from "../pages/reset/ConfirmResetPassword";
import ProtectedPages from "./ProtectedPages";
import NotFound from "../pages/redirect/NotFound";
import OrderNotFound from "../pages/redirect/OrderNotFound";
import Restricted from "../pages/redirect/RestrictedPage";
import AdminOrder from "../pages/admin/AdminOrder";
import WarehouseMapPage from "../pages/WarehouseMapPage";
import Payment from "../components/Payment";
import Order from "../components/Order";
import SalesReport from "../components/Report";

const routes = [
  //Sandi
  <Route
    path="/collection"
    element={
      <ProtectedPages needLogin={true}>
        <CollectionPage />
      </ProtectedPages>
    }
  ></Route>,
  <Route path="/maps" element={<WarehouseMapPage />}></Route>,
  <Route
    path="/collection/:uuid"
    element={
      <ProtectedPages needLogin={true}>
        <DetailPage />
      </ProtectedPages>
    }
  ></Route>,

  // Admin Page
  <Route
    path="/admin/managedata"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <AdminManageDataPage />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/admin/product"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <AdminProductPage />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/admin/stockhistory"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <AdminHistoryPage />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/admin/mutation"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <AdminMutationPage />
      </ProtectedPages>
    }
  ></Route>,

  <Route path="/" element={<HomePage />}></Route>,
  <Route path="/register" element={<Register />}></Route>,
  <Route path="/login" element={<Login />}></Route>,
  <Route path="/verify" element={<Verify />}></Route>,
  <Route path="/reset_password" element={<ResetPassword />}></Route>,
  <Route
    path="/reset-password/:token"
    element={<ConfirmResetPassword />}
  ></Route>,

  <Route path="/not-found" element={<NotFound />}></Route>,
  <Route path="/order-not-found" element={<OrderNotFound />}></Route>,
  <Route path="/restricted" element={<Restricted />}></Route>,

  <Route
    path="/user_profile"
    element={
      <ProtectedPages needLogin={true}>
        <UserProfile />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/user_list"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <UserList />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/add_user"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <AddUser />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/edit_user"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <EditUser />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/admin_profile"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <AdminProfile />
      </ProtectedPages>
    }
  ></Route>,

  <Route
    path="/admin_order"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <AdminOrder />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/report"
    element={
      <ProtectedPages needLogin={true} needLoginAdmin={true}>
        <SalesReport />
      </ProtectedPages>
    }
  ></Route>,

  // Maulana
  <Route
    path="/cart"
    element={
      <ProtectedPages needLogin={true}>
        <Cart />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/checkout"
    element={
      <ProtectedPages needLogin={true}>
        <Checkout />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/payment/:id"
    element={
      <ProtectedPages needLogin={true}>
        <Payment />
      </ProtectedPages>
    }
  ></Route>,
  <Route
    path="/order"
    element={
      <ProtectedPages needLogin={true}>
        <Order />
      </ProtectedPages>
    }
  ></Route>,
];

export default routes;
