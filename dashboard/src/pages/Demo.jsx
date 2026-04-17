import React, { useState } from "react";

const Demo = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/v1/autocomplete?q=${value}`,
        {
          headers: {
            "x-api-key": "ak_511736bdf1c085191975f0985d90104f",
          },
        }
      );

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setSuggestions(data.data);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      setSuggestions([]);
    }

    setLoading(false);
  };

  const handleSelect = (item) => {
  if (!item) return;

  setSelected({
    ...item,
    hierarchy: item.hierarchy || {},
  });

  setQuery(item.label || "");
  setSuggestions([]);
};

  const copyAddress = () => {
    navigator.clipboard.writeText(selected.fullAddress);
    alert("Address copied!");
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
    alert("JSON copied!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📍 Village Search Demo</h2>

      {/* INPUT */}
      <input
        type="text"
        placeholder="Type village name..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={styles.input}
      />
        {!query && !selected && (
      <p style={{ marginTop: "10px", color: "#64748b" }}>
        Start typing to search villages...
      </p>
    )} 
      {/* LOADING */}
      {loading && <p style={styles.loading}>Searching...</p>}

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
  <div style={styles.dropdown}>
    {suggestions.map((item, index) => (
      <div
        key={index}
        style={styles.item}
        onClick={() => handleSelect(item)}
      >
        {item.label}
        <span style={styles.sub}>
          {" "}
          ({item.hierarchy?.district}, {item.hierarchy?.state})
        </span>
      </div>
    ))}
  </div>
)}
      {/* NO RESULTS */}
      {!loading && query.length >=2 && suggestions.length === 0 &&  !selected &&(
  <p style={{ marginTop: "10px", color: "red" }}>
    No villages found
  </p>
)}
      {/* RESULT */}
      {selected && (
        <div style={styles.result}>
          <h3>📌 Full Address</h3>
          <p>{selected.fullAddress}</p>

          <div style={styles.buttonGroup}>
            <button style={styles.button} onClick={copyAddress}>
              📋 Copy Address
            </button>

            <button style={styles.button} onClick={copyJSON}>
              📥 Copy JSON
            </button>
          </div>

          <h4 style={{ marginTop: "15px" }}>Hierarchy</h4>
          <p>Village: {selected.hierarchy.village}</p>
          <p>Sub-district: {selected.hierarchy.subDistrict}</p>
          <p>District: {selected.hierarchy.district}</p>
          <p>State: {selected.hierarchy.state}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "650px",
    margin: "0 auto",
  },
  heading: {
    marginBottom: "20px",
    color: "#1e293b",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "16px",
    outline: "none",
  },
  loading: {
    marginTop: "8px",
    color: "#4f46e5",
  },
  dropdown: {
    background: "#fff",
    border: "1px solid #ddd",
    marginTop: "5px",
    borderRadius: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
  },
  option: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  sub: {
    color: "#64748b",
    fontSize: "12px",
  },
  noResult: {
    marginTop: "10px",
    color: "#ef4444",
  },
  result: {
    marginTop: "20px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    padding: "8px 12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Demo;