import { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ApiKeys from "./pages/ApiKeys";
import Logs from "./pages/Logs";
import Demo from "./pages/Demo";
function App() {
  const [page, setPage] = useState(() => {
  return localStorage.getItem("page") || "dashboard";
});

useEffect(() => {
  localStorage.setItem("page", page);
}, [page]);
  return (
    <MainLayout setPage={setPage}>
      {page === "dashboard" && <Dashboard />}
      {page === "logs" && <Logs />}
      {page === "users" && <Users />}
      {page === "apikeys" && <ApiKeys />}
      {page === "demo" && <Demo />}
    </MainLayout>
  );
}

export default App;