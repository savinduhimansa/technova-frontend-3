import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfileBar() {
  const [me, setMe] = useState(null);     // { name, email, role }
  const [kind, setKind] = useState(null); // "user" | "staff" | "unknown"
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!token) {
      console.debug("ProfileBar: no token found in localStorage");
      setKind(null);
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        // try user first
        const r1 = await axios.get("http://localhost:5001/api/user/me", { headers: authHeaders });
        const u = r1.data?.user || r1.data;
        if (u) {
          setMe({
            name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email,
            email: u.email,
            role: u.role || "user",
          });
          setKind("user");
          console.debug("ProfileBar: detected user token");
          return;
        }
      } catch (e1) {
        console.debug("ProfileBar: /api/user/me failed", e1?.response?.status, e1?.response?.data);
      }

      try {
        // try staff
        const r2 = await axios.get("http://localhost:5001/api/staff/me", { headers: authHeaders });
        const s = r2.data?.staff || r2.data;
        if (s) {
          setMe({
            name: s.name || s.email,
            email: s.email,
            role: s.role || "staff",
          });
          setKind("staff");
          console.debug("ProfileBar: detected staff token");
          return;
        }
      } catch (e2) {
        console.debug("ProfileBar: /api/staff/me failed", e2?.response?.status, e2?.response?.data);
        setErrorMsg(e2?.response?.data?.message || "Unable to fetch profile");
      } finally {
        setLoading(false);
        if (!me && !kind) setKind("unknown"); // token exists but /me calls failed
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  };

  // --- UI helpers ---
  const initials = (me?.name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

  // Loading shimmer bar (so you see it’s working)
  if (token && loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 mt-6">
        <div className="animate-pulse h-14 rounded-2xl border border-blue-200/40 bg-white/60" />
      </div>
    );
  }

  // No token? Don’t show the bar.
  if (!token) return null;

  // If token exists but profile failed, still show a minimal bar with Logout,
  // and a hint to check backend routes.
  if (kind === "unknown" || !me) {
    return (
      <div className="mx-auto max-w-6xl px-4 mt-6">
        <div className="flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="text-amber-900 text-sm">
            You’re signed in, but we couldn’t load your profile.{" "}
            <span className="font-medium">Check /api/user/me and /api/staff/me routes</span>.
            {errorMsg ? ` (${errorMsg})` : ""}
          </div>
          <div className="flex items-center gap-2">
            {/* Keep a link to Profile in case only one route works intermittently */}
            <button
              onClick={() => navigate("/profile")}
              className="px-3 py-2 rounded-lg text-sm font-semibold border border-amber-300 text-amber-900 hover:bg-amber-100"
            >
              Try Profile
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal, happy path (user or staff)
  return (
    <div className="mx-auto max-w-6xl px-4 mt-6">
      <div className="flex items-center justify-between rounded-2xl border border-blue-200/40 bg-white/80 backdrop-blur px-4 py-3 shadow-[0_0_20px_rgba(59,130,246,0.12)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white grid place-items-center font-bold">
            {initials}
          </div>
          <div>
            <div className="text-sm text-blue-900/70">Signed in as</div>
            <div className="text-lg font-semibold text-blue-900">{me.name}</div>
            <div className="text-xs text-blue-900/70">{me.email} • {kind === "staff" ? `Staff: ${me.role}` : `Role: ${me.role}`}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {kind === "user" && (
            <button
              onClick={() => navigate("/profile")}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              View Profile
            </button>
          )}
          <button
            onClick={logout}
            className="px-3 py-2 rounded-lg text-sm font-semibold border border-blue-300 text-blue-900 hover:bg-blue-50"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
