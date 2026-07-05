import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = useSelector((store) => store.authSlice?.user);
  const loading = useSelector((store) => store.authSlice?.loading);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner} />
        <p style={styles.text}>Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
    gap: "16px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "5px solid #e0e0e0",
    borderTop: "5px solid #1775ee",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  text: {
    color: "#555",
    fontSize: "16px",
    fontWeight: 500,
  },
};

// Inject keyframes once
if (!document.getElementById("spin-keyframes")) {
  const style = document.createElement("style");
  style.id = "spin-keyframes";
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}