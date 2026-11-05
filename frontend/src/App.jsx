import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute, RoleRoute } from "./routes/guards";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Shop from "./pages/shop/Shop";
import ProductDetails from "./pages/shop/ProductDetails";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";
import Orders from "./pages/shop/Orders";
import OrderDetails from "./pages/shop/OrderDetails";
import Profile from "./pages/shop/Profile";
import Wishlist from "./pages/shop/Wishlist";
import Addresses from "./pages/shop/Addresses";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

function Home() {
  const { user } = useAuth();
  return (
    <Navigate
      to={user ? (user.role === "admin" ? "/admin" : "/shop") : "/login"}
      replace
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/shop"
          element={
            <RoleRoute role="user">
              <Shop />
            </RoleRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <RoleRoute role="user">
              <ProductDetails />
            </RoleRoute>
          }
        />
        <Route
          path="/product/:id/reviews"
          element={
            <RoleRoute role="user">
              <ProductDetails reviews />
            </RoleRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <RoleRoute role="user">
              <Cart />
            </RoleRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <RoleRoute role="user">
              <Checkout />
            </RoleRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <RoleRoute role="user">
              <Orders />
            </RoleRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <RoleRoute role="user">
              <OrderDetails />
            </RoleRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleRoute role="user">
              <Profile />
            </RoleRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <RoleRoute role="user">
              <Wishlist />
            </RoleRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <RoleRoute role="user">
              <Addresses />
            </RoleRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RoleRoute role="admin">
              <AdminProducts />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RoleRoute role="admin">
              <AdminOrders />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute role="admin">
              <AdminUsers />
            </RoleRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
