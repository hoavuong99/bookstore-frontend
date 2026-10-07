import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import AllBooksPage from "../pages/books/AllBooksPage";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";
import PaymentResultPage from "../pages/books/PaymentResultPage";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import UserProfile from "../pages/dashboard/users/UserProfile";
import UserChangePassword from "../pages/dashboard/users/UserChangePassword";
import Home from "../pages/home/Home";
import ManageCategories from "../pages/dashboard/categories/ManageCategories";
import ManageOrders from "../pages/dashboard/orders/ManageOrders";
import ManageUsers from "../pages/dashboard/users/ManageUsers";
import AdminProfile from "../pages/dashboard/AdminProfile";
import AdminChangePassword from "../pages/dashboard/AdminChangePassword";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <Home/>,
        },
        {
            path: "/orders",
            element: <PrivateRoute><OrderPage/></PrivateRoute>
        },
        {
            path: "/payment-result",
            element: <PrivateRoute><PaymentResultPage/></PrivateRoute>
        },
        {
            path: "/about",
            element: <div>Giới thiệu</div>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
          path: "/cart",
          element: <CartPage/>
        },
        {
          path: "/checkout",
          element: <PrivateRoute><CheckoutPage/></PrivateRoute>
        },
        {
          path: "/books/:id",
          element: <SingleBook/>
        },
        {
          path: "/books",
          element: <AllBooksPage/>
        },
        {
          path: "/user-dashboard/profile",
          element: <PrivateRoute><UserProfile/></PrivateRoute>
        },
        {
          path: "/user-dashboard/change-password",
          element: <PrivateRoute><UserChangePassword/></PrivateRoute>
        }
        
      ]
    },
    {
      path: "/admin",
      element: <Login/>
    },
    {
      path: "/dashboard",
      element: <AdminRoute>
        <DashboardLayout/>
      </AdminRoute>,
      children:[
        {
          path: "",
          element: <AdminRoute><Dashboard/></AdminRoute>
        },
        {
          path: "manage-books",
          element: <AdminRoute>
            <ManageBooks/>
          </AdminRoute>
        },
        {
          path: "categories",
          element: <AdminRoute>
            <ManageCategories/>
          </AdminRoute>
        },
        {
          path: "orders",
          element: <AdminRoute>
            <ManageOrders/>
          </AdminRoute>
        },
        {
          path: "users",
          element: <AdminRoute>
            <ManageUsers/>
          </AdminRoute>
        },
        {
          path: "profile",
          element: <AdminRoute>
            <AdminProfile/>
          </AdminRoute>
        },
        {
          path: "change-password",
          element: <AdminRoute>
            <AdminChangePassword/>
          </AdminRoute>
        }
      ]
    }
  ]);

  export default router;