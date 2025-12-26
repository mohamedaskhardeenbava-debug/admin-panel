import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

import Dashboard from "./pages/Dashboard";
import Ingredients from "./pages/Ingredients";
import Dishes from "./pages/Dishes";
import Categories from "./pages/Categories";
import IngredientDetails from "./pages/IngredientDetails";
import DishDetails from "./pages/DishDetails";
import Login from "./pages/Login";

import api from "./api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [adminData, setAdminData] = useState({
    ingredients: [],
    categories: []
  });

  /* ---------------- LOGIN HANDLER ---------------- */
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  /* ---------------- FETCH MENU ---------------- */
  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setAdminData({
        ingredients: res.data.ingredients,
        categories: res.data.categories
      });
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenu();
    }
  }, [isAuthenticated]);

  /* ---------------- INGREDIENT CRUD ---------------- */
  const addIngredient = async (ingredient) => {
    const res = await api.get("/menu");

    const updatedMenu = {
      ...res.data,
      ingredients: [...res.data.ingredients, ingredient]
    };

    await api.put("/menu", updatedMenu);

    setAdminData((prev) => ({
      ...prev,
      ingredients: updatedMenu.ingredients
    }));
  };

  const updateIngredient = async (id, updated) => {
    const res = await api.get("/menu");

    const updatedMenu = {
      ...res.data,
      ingredients: res.data.ingredients.map((ing) =>
        ing.id === id ? updated : ing
      )
    };

    await api.put("/menu", updatedMenu);

    setAdminData((prev) => ({
      ...prev,
      ingredients: updatedMenu.ingredients
    }));
  };

  const deleteIngredient = async (id) => {
    const res = await api.get("/menu");

    const updatedMenu = {
      ...res.data,
      ingredients: res.data.ingredients.filter(
        (ing) => ing.id !== id
      )
    };

    await api.put("/menu", updatedMenu);

    setAdminData((prev) => ({
      ...prev,
      ingredients: updatedMenu.ingredients
    }));
  };

  /* ---------------- AUTH GUARD ---------------- */
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="*"
          element={<Login onLogin={handleLogin} />}
        />
      </Routes>
    );
  }

  /* ---------------- ADMIN LAYOUT ---------------- */
  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} />

      <div className={`app-main ${isSidebarOpen ? "expanded" : "collapsed"}`}>
        <Topbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="page">
          <Routes>
            <Route path="/" element={<Dashboard adminData={adminData} />} />

            <Route
              path="/categories"
              element={
                <Categories
                  adminData={adminData}
                  setAdminData={setAdminData}
                />
              }
            />

            <Route
              path="/ingredients"
              element={
                <Ingredients
                  adminData={adminData}
                  onAdd={addIngredient}
                  onUpdate={updateIngredient}
                  onDelete={deleteIngredient}
                />
              }
            />

            <Route
              path="/ingredients/:ingredientId"
              element={
                <IngredientDetails
                  adminData={adminData}
                  setAdminData={setAdminData}
                />
              }
            />

            <Route
              path="/dishes/:categoryId?"
              element={
                <Dishes
                  adminData={adminData}
                  setAdminData={setAdminData}
                />
              }
            />

            <Route
              path="/dishes/:categoryId/:dishId"
              element={
                <DishDetails
                  adminData={adminData}
                  setAdminData={setAdminData}
                />
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
