import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminTicketStats, getAllTicketsForAdmin } from "../../services/ticketService";
import { adminGetAllBookings } from "../../services/bookingService";
import { getAllResources } from "../../services/resourceService";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    resources: 0,
    bookings: 0,
    tickets: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ticketStats, allTickets, allBookings, allResources] = await Promise.all([
          getAdminTicketStats(),
          getAllTicketsForAdmin(),
          adminGetAllBookings(),
          getAllResources()
        ]);

        setStats({
          resources: allResources.length,
          bookings: allBookings.filter(b => b.status === "PENDING").length,
          tickets: ticketStats.open || 0,
        });

        // Get 5 most recent tickets
        const sortedTickets = [...allTickets].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
        
        setRecentTickets(sortedTickets);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Active Resources", value: stats.resources, icon: "🏢", link: "/admin/resources", className: "resources-card" },
    { label: "Pending Bookings", value: stats.bookings, icon: "📅", link: "/admin/bookings", className: "bookings-card" },
    { label: "Open Tickets", value: stats.tickets, icon: "🎫", link: "/admin/tickets", className: "tickets-card" },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="admin-dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <div className="header-badge">Control Panel</div>
        <h1>Admin Command Center</h1>
        <p>Holistic overview of campus resources, bookings, and incident reports.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className={`stat-card ${s.className}`}>
            <div className="card-top">
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-trend">↑ Live</div>
            </div>
            <h3 className="stat-label">{s.label}</h3>
            <p className="stat-value">{s.value}</p>
            <Link to={s.link} className="manage-link">Manage Database →</Link>
          </div>
        ))}
      </div>

      <div className="dashboard-content-grid">
        <div className="recent-tickets-panel">
          <div className="panel-header">
            <h2>Recent Incident Tickets</h2>
            <Link to="/admin/tickets" className="view-all-link">View All Tickets</Link>
          </div>
          
          {loading ? (
            <div className="panel-loader">Loading recent updates...</div>
          ) : recentTickets.length === 0 ? (
            <div className="empty-panel">No recent tickets to display.</div>
          ) : (
            <div className="recent-list">
              {recentTickets.map(ticket => (
                <div key={ticket.id} className="recent-item">
                  <div className="item-main">
                    <span className={`prio-dot ${ticket.priority.toLowerCase()}`} />
                    <div className="item-info">
                      <span className="item-title">{ticket.title}</span>
                      <span className="item-meta">{ticket.createdBy} ● {formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                  <div className={`status-tag ${ticket.status.toLowerCase()}`}>
                    {ticket.status.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quick-actions-panel">
          <h2>Quick Management</h2>
          <div className="quick-actions-grid">
            <Link to="/admin/resources" className="action-btn">
              <span className="btn-icon">➕</span>
              <div className="btn-text">
                <strong>New Resource</strong>
                <span>Add facility to campus</span>
              </div>
            </Link>
            <Link to="/admin/bookings" className="action-btn">
              <span className="btn-icon">✔️</span>
              <div className="btn-text">
                <strong>Review Approvals</strong>
                <span>Pending booking requests</span>
              </div>
            </Link>
            <Link to="/admin/tickets" className="action-btn">
              <span className="btn-icon">🎫</span>
              <div className="btn-text">
                <strong>Track Issues</strong>
                <span>Monitor all user reports</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;