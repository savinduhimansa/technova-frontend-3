import { Navigate, useLocation } from "react-router-dom";

// tiny helper to read the 'role' from the token payload
function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64 = token.split(".")[1];
    const json = JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")));
    return json?.role || null; // "admin" (User) or "salesManager" (Staff) etc.
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children, allow = [] }) {
  const loc = useLocation();
  const role = getRoleFromToken();
  const authed = !!role;

  if (!authed) return <Navigate to="/login" replace state={{ from: loc }} />;

  if (Array.isArray(allow) && allow.length > 0 && !allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
