import { useEffect, useState } from "react";
import Signup from "./Signup";
const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  fetch("http://localhost:3000/v1/users", {
    headers: {
      "x-api-key": "ak_511736bdf1c085191975f0985d90104f",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    })
    .catch(() => setUsers([]));
}, []);

  return (
    <div>
      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>👥 Users</h2>
      <Signup onUserAdded={() => window.location.reload()}/>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Plan</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  {new Date(user.created_at).toLocaleString()}
                </td>
                <td>{user.plan}</td>
              </tr>
            ))
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
};

export default Users;