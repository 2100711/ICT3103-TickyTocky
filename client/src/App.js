import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import Discover from "./components/discover";
import Catalogue from "./components/catalogue";
import Product from "./components/product";
import Dashboard from "./components/dashboard";
import constants from "./constants.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={constants.Home} element={<Home />} />
        <Route path={constants.Login} element={<Login />} />
        <Route path={constants.Register} element={<Register />} />
        <Route path={constants.Discover} element={<Discover />} />
        <Route path={constants.Catalogue} element={<Catalogue />} />
        <Route path={constants.Product} element={<Product />} />
        <Route path={constants.Dashboard} element={<Dashboard />} />
        {/* PROTECTED ROUTES */}
        {/* <Route
          path={constants.ACCOUNT_URL}
          element={
            <ProtectedRoute user={userID}>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path={constants.ADMIN_URL}
          element={
            <ProtectedRoute user={userID}>
              <Admin />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
