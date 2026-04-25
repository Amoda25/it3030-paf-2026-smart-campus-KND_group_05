import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/authService";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Could not load profile details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>
        <p>Fetching your campus profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-id-badge-large">
            {profile?.idNumber || "ID"}
          </div>
          <div className="profile-header-info">
            <span className="id-label-prefix">Digital Student Identity</span>
            <h1>{profile?.name}</h1>
            <p className="profile-email">{profile?.email}</p>
            <div className="profile-department-chip">{profile?.department || "No Department"}</div>
          </div>
        </div>


        <div className="profile-details-section">
          <h2>Identity Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <label>Full Name</label>
              <p>{profile?.name}</p>
            </div>
            <div className="detail-item">
              <label>ID / Index Number</label>
              <p>{profile?.idNumber || "Not Set"}</p>
            </div>
            <div className="detail-item">
              <label>Department / Faculty</label>
              <p>{profile?.department || "Not Set"}</p>
            </div>
            <div className="detail-item">
              <label>University Email</label>
              <p>{profile?.email}</p>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-box">
            <h3>Account Type</h3>
            <p>{profile?.role === 'ADMIN' ? 'Administrator' : 'Student User'}</p>
          </div>
          <div className="stat-box">
            <h3>Status</h3>
            <p className="active-status">Active</p>
          </div>
        </div>

        <div className="profile-actions">
           <button className="edit-profile-btn" disabled>
             Edit Profile (Coming Soon)
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
