
import { createTicket } from "../../services/ticketService";
import "./TicketForm.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserBookings } from "../../services/bookingService";
import { getAllResources } from "../../services/resourceService";

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  const [category, setCategory] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [bookedResources, setBookedResources] = useState([]);
  const [location, setLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [images, setImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, allResources] = await Promise.all([
          getUserBookings(),
          getAllResources()
        ]);

        // Get unique resource IDs from user's bookings
        const bookedResourceIds = [...new Set(bookings.map(b => b.resourceId))];
        
        // Match with resource details
        const myBookedResources = allResources.filter(r => bookedResourceIds.includes(r.id));
        setBookedResources(myBookedResources);
      } catch (error) {
        console.error("Failed to fetch booked resources:", error);
      }
    };
    fetchData();
  }, []);

  const validate = (name, value) => {
    let error = "";
    if (!value || (typeof value === "string" && !value.trim())) {
      error = "This field is required";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };


  

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (images.length + selectedFiles.length > 3) {
      setErrorMessage("You can upload a maximum of 3 files.");
      return;
    }

    const newImages = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setErrorMessage("");
    setImages(prev => [...prev, ...newImages]);
    
    // Reset input value so same file can be selected again if removed
    e.target.value = "";
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const fieldsToValidate = {
      title,
      category,
      priority,
      location,
      description,
      contactName,
      contactDetails
    };

    let hasErrors = false;
    const newErrors = {};
    Object.keys(fieldsToValidate).forEach(key => {
      const val = fieldsToValidate[key];
      if (!val || (typeof val === 'string' && !val.trim())) {
        newErrors[key] = "This field is required";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      setErrorMessage("Please fill in all required fields.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("category", category);
      formData.append("resourceId", resourceId);
      formData.append("location", location);
      formData.append("contactName", contactName);
      formData.append("contactDetails", contactDetails);



      images.forEach((imgObj) => {
        formData.append("images", imgObj.file);
      });

      await createTicket(formData);

      setSuccessMessage("Ticket created successfully.");
      setTitle("");
      setDescription("");
      setPriority("");
      setImages([]);
      setTimeout(() => {
        navigate("/user/tickets");
      }, 1500);
    } catch (error) {
      console.error("Ticket creation failed:", error);
      const errorMsg = error.response?.data?.message || "Failed to create ticket. Please check your connection and try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rd-page">
      <div className="create-wrapper">
        <div className="create-card">
          <div className="create-header">
            <div className="badge">Maintenance & Incident Ticketing</div>
            <h1>CREATE INCIDENT TICKET</h1>
            <p>Report a campus resource or location issue with resource selection, priority, contact details and up to 3 evidence files (Images/PDF).</p>
          </div>

          <form onSubmit={handleSubmit} className="create-form">
            <div className="field">
              <label>Ticket Title *</label>
              <input
                type="text"
                placeholder="Example: Projector not working in Lab 03"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  validate("title", e.target.value);
                }}
                className={errors.title ? "input-error" : ""}
                required
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-row">
              <div className="field">
                <label>Resource *</label>
                <select
                  value={resourceId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setResourceId(selectedId);
                    const selectedResource = bookedResources.find(r => r.id === selectedId);
                    if (selectedResource) {
                      setCategory(selectedResource.name);
                      setLocation(selectedResource.location);
                      validate("category", selectedResource.name);
                      validate("location", selectedResource.location);
                    } else {
                      setCategory(selectedId === "OTHER" ? "OTHER" : "");
                      if (selectedId === "OTHER") {
                        validate("category", "OTHER");
                      }
                    }
                  }}
                  className={errors.category ? "input-error" : ""}
                  required
                >
                  <option value="">Select resource</option>
                  {bookedResources.map(res => (
                    <option key={res.id} value={res.id}>
                      {res.name} ({res.type})
                    </option>
                  ))}
                  <option value="OTHER">Other / Not Listed</option>
                </select>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>

              <div className="field">
                <label>Priority *</label>
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    validate("priority", e.target.value);
                  }}
                  className={errors.priority ? "input-error" : ""}
                  required
                >
                  <option value="">Select priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {errors.priority && <span className="field-error">{errors.priority}</span>}
              </div>
            </div>

            <div className="field">
              <label>Location *</label>
              <input
                type="text"
                placeholder="Example: B401 / Lab 03"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  validate("location", e.target.value);
                }}
                className={errors.location ? "input-error" : ""}
                required
              />
              {errors.location && <span className="field-error">{errors.location}</span>}
            </div>

            <div className="field">
              <label>Issue Description *</label>
              <textarea
                placeholder="Describe the issue clearly. Example: Projector turns on, but the display is blank."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  validate("description", e.target.value);
                }}
                className={errors.description ? "input-error" : ""}
                rows="5"
                required
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="field">
                <label>Contact Name *</label>
                <input
                  type="text"
                  placeholder="Example: Samindi Wijekoon"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    validate("contactName", e.target.value);
                  }}
                  className={errors.contactName ? "input-error" : ""}
                  required
                />
                {errors.contactName && <span className="field-error">{errors.contactName}</span>}
              </div>

              <div className="field">
                <label>Preferred Contact Details *</label>
                <input
                  type="text"
                  placeholder="Email or phone number"
                  value={contactDetails}
                  onChange={(e) => {
                    setContactDetails(e.target.value);
                    validate("contactDetails", e.target.value);
                  }}
                  className={errors.contactDetails ? "input-error" : ""}
                  required
                />
                {errors.contactDetails && <span className="field-error">{errors.contactDetails}</span>}
              </div>
            </div>

            <div className="field">
              <label>Upload Evidence Files</label>
              <div className="file-upload-box">
                <div className="file-upload-content">
                  <strong>Attach images or PDFs as evidence</strong>
                  <p>Maximum 3 files allowed. Use damaged equipment photos or relevant documents.</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleFileChange}
                    id="file-input"
                  />
                </div>
              </div>
              {images.length > 0 && (
                <div className="image-preview-grid">
                  {images.map((img, i) => (
                    <div key={i} className="preview-card">
                      {img.file.type === "application/pdf" ? (
                        <div className="pdf-preview-icon">
                          <span className="pdf-label">PDF</span>
                        </div>
                      ) : (
                        <img src={img.preview} alt={`Preview ${i}`} />
                      )}
                      <button 
                        type="button" 
                        className="remove-img-btn"
                        onClick={() => removeImage(i)}
                        title="Remove image"
                      >
                        &times;
                      </button>
                      <div className="img-info">
                        <span>{img.file.name.length > 15 ? img.file.name.substring(0, 12) + '...' : img.file.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Incident Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



export default TicketForm;