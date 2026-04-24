import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    { label: "Resources", value: "24", icon: "🏢", link: "/admin/resources" },
    { label: "Bookings", value: "12", icon: "📅", link: "/admin/bookings" },
    { label: "Open Tickets", value: "8", icon: "🎫", link: "/admin/tickets" },
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#0f172a", marginBottom: "8px" }}>Admin Command Center</h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b" }}>Overview of campus operations and management.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#fff", padding: "32px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>{s.icon}</div>
            <h3 style={{ fontSize: "0.9rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{s.label}</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "#0f172a", margin: "8px 0 20px" }}>{s.value}</p>
            <Link to={s.link} style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none", fontSize: "0.9rem" }}>Manage {s.label} →</Link>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "24px", color: "#0f172a" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <Link to="/admin/resources" style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "#334155", fontWeight: "600", border: "1px solid #e2e8f0" }}>Add Resource</Link>
          <Link to="/admin/bookings" style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "#334155", fontWeight: "600", border: "1px solid #e2e8f0" }}>Review Bookings</Link>
          <Link to="/admin/tickets" style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", textAlign: "center", textDecoration: "none", color: "#334155", fontWeight: "600", border: "1px solid #e2e8f0" }}>View Tickets</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;