import React, { useState } from "react";
import Hero from "../components/Hero";
import QualitySection from "../components/QualitySection";
// import CtaSection from "../components/CtaSection";
import NewsletterSection from "../components/NewsletterSection";
import backgroundImage from "../assets/palace-1366178.webp";
import "../css/FormStyles.css";
import { BASE_URL } from "../services/apiService";
const FixedRateReminder = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    expiryDate: "",
    lender: "",
    serviceType: "Buy to Let"
  });
  
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    if (formData.expiryDate <= today) {
      setError("Fixed Rate Expiry Date must be in the future.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${BASE_URL}/submit-fixed-rate-reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Error submitting form: " + result.error);
      }
    } catch (error) {
      alert("Error submitting form. Please try again later.");
      console.error("Submission error:", error);
    }
  };

  return (
    <>
      <Hero
        title="Fixed Rate Reminder"
        subHeading="Stay Ahead of Your Mortgage Expiry Date"
        detail="Get notified before your fixed rate mortgage expires so you can secure the best deal in time."
        className="hero-4"
        imageUrl={backgroundImage}
      />

      <div className="form-section-wrapper">
        {/* Left info panel */}
        <div className="form-info-side">
          <h2 className="ultra-heading">
            DON'T LET YOUR<br />RATE EXPIRE.
          </h2>
          <p className="form-desc-large">
            When your fixed rate ends, your lender automatically moves you to a standard variable rate — often significantly higher. Set a reminder now and let our advisors find you a better deal before that happens.
          </p>
          <div className="contact-details-minimal">
            <div className="contact-item">
              <span className="contact-label">CALL US</span>
              <span className="contact-value">+44 20 4538 9255</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">EMAIL US</span>
              <span className="contact-value">info@uklending.london</span>
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="form-box-modern">
          {error && <p className="submission-message" style={{ borderColor: '#e53e3e', background: '#fff5f5', color: '#e53e3e' }}>{error}</p>}

          <form onSubmit={handleSubmit} className="modern-form">

            <div className="form-section">
              <span className="section-label">YOUR DETAILS</span>
              <div className="form-grid">
                <div className="form-group-modern">
                  <input
                    className="modern-input"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-modern">
                  <input
                    className="modern-input"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-modern">
                  <input
                    className="modern-input"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-modern">
                  <input
                    className="modern-input"
                    type="text"
                    name="lender"
                    placeholder="Current Lender Name"
                    value={formData.lender}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <span className="section-label">FIXED RATE DETAILS</span>
              <div className="form-grid">
                <div className="form-group-modern">
                  <input
                    className="modern-input"
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-helper">Fixed Rate Expiry Date</span>
                </div>
                <div className="form-group-modern">
                  <select
                    className="modern-input"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Buy to Let">Buy to Let</option>
                    <option value="Residential">Residential</option>
                  </select>
                  <span className="input-helper">Mortgage Type</span>
                </div>
              </div>
            </div>

            <button type="submit" className="modern-submit-btn">
              SET MY REMINDER
            </button>
          </form>

          <p className="legal-statement">Your home may be repossessed if you do not keep up repayments on your mortgage.</p>
        </div>
      </div>

      <QualitySection
        preHeader="Supporting Your Financial Goals"
        mainHeading="Why Set a Fixed Rate Reminder?"
        description="Avoid costly surprises by staying informed about your mortgage expiration date. Our reminder service helps you plan ahead and secure the best refinancing deals."
        backgroundImage={backgroundImage}
      />
      <NewsletterSection/>
    </>
  );
};

export default FixedRateReminder;