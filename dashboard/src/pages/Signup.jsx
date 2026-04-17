import React, { useState } from "react";

const Signup = ({ onUserAdded }) => {
  const [email, setEmail] = useState("");

  const handleSignup = () => {
    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("User added successfully!");
          setEmail("");
          onUserAdded && onUserAdded();
        }
      });
  };

  return (
    <div style={styles.box}>
      <h2>Add User</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleSignup} style={styles.button}>
        Add User
      </button>
    </div>
  );
};

const styles = {
  box: {
    background: "#040a45",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    marginRight: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Signup;