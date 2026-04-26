import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserTickets, deleteUserTicket } from "../../services/ticketService";
import "./MyTicketsPage.css";

function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const data = await getUserTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setErrorMessage("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/user/tickets/${ticketId}`);
  };

  const handleDeleteTicket = async (ticketId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      await deleteUserTicket(ticketId);
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || error.response?.data?.error || "Failed to delete ticket.");
    }
  };

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === "OPEN" || t.status === "IN_PROGRESS").length,
    resolved: tickets.filter(t => t.status === "RESOLVED").length
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === "ALL") return true;
    return ticket.status === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="soft-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>My Tickets</h1>
            <p>Track and manage all your submitted support tickets in one place.</p>
          </div>

          <div className="stats-panel">
            <div className="stat-box">
              <h2>{stats.total}+</h2>
              <p>Total Tickets</p>
            </div>
            <div className="stat-box">
              <h2>{stats.pending}</h2>
              <p>Pending</p>
            </div>
            <div className="stat-box">
              <h2>{stats.resolved}</h2>
              <p>Resolved</p>
            </div>
          </div>
        </div>
      </section>

      <section className="catalogue-shell">
        <div className="catalogue-header">
          <div className="header-text">
            <h2>Support Tickets</h2>
            <p>View and manage your technical assistance requests.</p>
          </div>
          <button className="create-btn" onClick={() => navigate("/user/tickets/create")}>
            + New Ticket
          </button>
        </div>

          {/* Filter Section */}
          <div className="filter-section">
            {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((status) => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? "active" : ""}`}
                onClick={() => setFilter(status)}
              >
                {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Ticket Cards Grid */}
          {loading ? (
            <div className="loading-state">Loading tickets...</div>
          ) : errorMessage ? (
            <div className="error-state">{errorMessage}</div>
          ) : filteredTickets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No tickets found</p>
            </div>
          ) : (
            <div className="tickets-grid">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card-premium">
                  <div className="ticket-card-header">
                    <h3 className="ticket-title">📌 {ticket.title}</h3>
                    <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="ticket-description">{ticket.description}</p>

                  <div className="ticket-info-list">
                    <div className="info-row">
                      <span className="info-icon">📍</span>
                      <span className="info-label">Location:</span>
                      <span className="info-text">{ticket.location || "Lab 03"}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">⚡</span>
                      <span className="info-label">Priority:</span>
                      <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">🆔</span>
                      <span className="info-label">Ticket ID:</span>
                      <span className="info-text">#{ticket.id}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">🗓️</span>
                      <span className="info-label">Created:</span>
                      <span className="info-text">{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>

                  <div className="ticket-actions-premium">
                    <button className="view-details-btn" onClick={() => handleViewTicket(ticket.id)}>
                      View Details
                    </button>
                    <button className="delete-ticket-btn" onClick={() => handleDeleteTicket(ticket.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </section>
    </div>
  );
}

export default MyTicketsPage;