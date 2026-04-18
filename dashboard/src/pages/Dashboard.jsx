import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    avg: 0,
    today: 0,
  });

  useEffect(() => {
    fetch(`${API}/v1/analytics`, {
      headers: {
        "x-api-key": "ak_511736bdf1c085191975f0985d90104f",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) return;

        // chart data
        const formatted = res.data.daily.map((item) => ({
          day: item.date,
          requests: Number(item.requests),
        }));

        setData(formatted);

        // stats
        setStats({
          total: res.data.total,
          avg: res.data.avgResponse,
          today: res.data.today,
        });
      });
  }, []);

  return (
    <div>
      <h2 style={styles.heading}>📊 Dashboard</h2>

      {/* 🔥 STATS CARDS */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <h2>{stats.total}</h2>
          <p>Total Requests</p>
        </div>

        <div style={styles.card}>
          <h2>{stats.today}</h2>
          <p>Today's Requests</p>
        </div>

        <div style={styles.card}>
          <h2>{stats.avg} ms</h2>
          <p>Avg Response Time</p>
        </div>
      </div>

      {/* 📈 CHART */}
      <div style={styles.chartBox}>
        <h3 style={{ marginBottom: "20px", color: "#334155" }}>
          API Usage (Last 7 Days)
        </h3>

        <LineChart width={700} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="#4f46e5"
            strokeWidth={3}
          />
        </LineChart>
      </div>
    </div>
  );
};

const styles = {
  heading: {
    color: "#1e293b",
    marginBottom: "20px",
  },
  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    flex: 1,
    background: "#050000",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 15px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease",
    
  },
  chartBox: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
};

export default Dashboard;