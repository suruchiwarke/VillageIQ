import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL;
const ApiKeys = () => {
  const [keys, setKeys] = useState([]);

  // ✅ Fetch keys
  const fetchKeys = () => {
    fetch(`${API}/apikeys`, {
      headers: {
        "x-api-key": "ak_511736bdf1c085191975f0985d90104f",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setKeys(res.data);
        }
      })
      .catch((err) => console.error(err));
  };

  // ✅ Run on load
  useEffect(() => {
    fetchKeys();
  }, []);

  // ✅ Generate new key
  const generateKey = () => {
    fetch("https://villageiq.onrender.com/generate-key")
      .then((res) => res.json())
      .then((data) => {
        alert(
          "New API Key:\n" +
            data.apiKey +
            "\n\nSecret:\n" +
            data.apiSecret
        );

        fetchKeys(); // refresh list
      })
      .catch((err) => console.error(err));
  };

  // ✅ Delete key
  const deleteKey = (id) => {
    fetch(`${API}/apikeys/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": "ak_511736bdf1c085191975f0985d90104f",
      },
    })
      .then(() => fetchKeys())
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>
        🔑 API Keys
      </h2>

      {/* ✅ Button FIXED */}
      <button style={styles.button} onClick={generateKey}>
        + Generate New Key
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>API Key</th>
            <th>Created At</th>
            <th>Action</th> {/* ✅ Added */}
          </tr>
        </thead>

        <tbody>
          {keys.length > 0 ? (
            keys.map((key) => (
              <tr key={key.id}>
                <td>{key.id}</td>
                <td>{key.key?.slice(0, 8)}****</td>
                <td>{new Date(key.created_at).toLocaleString()}</td>

                {/* ✅ Delete button */}
                <td>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteKey(key.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No API keys found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    marginBottom: "20px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 10px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
};

export default ApiKeys;