import React, { useState } from "react";

const MainLayout = ({ children, setPage }) => {
  const [active, setActive] = useState("dashboard");

  const handlePage = (page) => {
    setActive(page);
    setPage(page);
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🌍 VillageIQ</h2>

        <div style={styles.menu}>
          {/* Dashboard */}
          <p
            style={{
              ...styles.menuItem,
              ...(active === "dashboard" ? styles.active : {}),
            }}
            onClick={() => handlePage("dashboard")}
          >
            📊 Dashboard
          </p>

          {/* Users */}
          <p
            style={{
              ...styles.menuItem,
              ...(active === "users" ? styles.active : {}),
            }}
            onClick={() => handlePage("users")}
          >
            👥 Users
          </p>

          {/* API Keys */}
          <p
            style={{
              ...styles.menuItem,
              ...(active === "apikeys" ? styles.active : {}),
            }}
            onClick={() => handlePage("apikeys")}
          >
            🔑 API Keys
          </p>

          {/* API Logs ✅ FIXED */}
          <p
            style={{
              ...styles.menuItem,
              ...(active === "logs" ? styles.active : {}),
            }}
            onClick={() => handlePage("logs")}
          >
            📡 API Logs
          </p>

          <p
  style={{
    ...styles.menuItem,
    ...(active === "demo" ? styles.active : {}),
  }}
  onClick={() => handlePage("demo")}
>
  📍 Demo
</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>{children}</div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },
  sidebar: {
    width: "230px",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
  },
  logo: {
    marginBottom: "30px",
    textAlign: "center",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
  },
  menuItem: {
    padding: "12px",
    cursor: "pointer",
    borderRadius: "8px",
    marginBottom: "10px",
    background: "transparent",
    transition: "all 0.2s ease",
    
  },
  active: {
    background: "#4f46e5",
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: "30px",
    background: "#f8fafc",
    overflow: "auto", // ✅ prevents content overflow
  },
};

export default MainLayout;