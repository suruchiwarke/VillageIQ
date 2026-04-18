import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;
const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("https://villageiq.onrender.com/admin/logs")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLogs(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>
        📜 API Logs
      </h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>API Key</th>
            <th>Endpoint</th>
            <th>Response Time (ms)</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={index}>
                <td>{log.api_key?.slice(0, 8)}****</td>
                <td>{log.endpoint}</td>
                <td>{log.response_time}</td>
                <td>{log.status_code}</td>
                <td>
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },

  th: {
  background: "#f1f5f9",
  padding: "10px",
  textAlign: "left",
},

td: {
  padding: "10px",
  borderBottom: "1px solid #e2e8f0",
},
};

export default Logs;