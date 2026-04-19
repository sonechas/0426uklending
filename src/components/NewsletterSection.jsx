import React, { useState } from "react";
import "../css/NewsletterSection.css";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = ""; // Relative to the domain

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("❌ Please enter a valid email.");
      return;
    }

    setMessage("Submitting...");

    try {
      //http://localhost:3000/subscribe
      //${API_URL}/subscribe
      const response = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setMessage("✅ Successfully subscribed! Check your inbox.");
        setEmail(""); // Clear input field
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "Unknown error occurred." };
        }
        setMessage(`❌ ${errorData.error || "Error subscribing, try again."}`);
      }
    } catch (error) {
      setMessage("❌ Network error, please try again.");
    }
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <div className="newsletter-inner">
          <div className="newsletter-left">
            <span className="pre-header">Empowering Property Investors</span>
            <h2 className="secondry-heading">
              Stay Informed with <br />UK Lending
            </h2>
          </div>
          <div className="newsletter-right">
            <p className="default-text">
              Join our mailing list for expert insights and updates on property finance.
            </p>
            <form className="form-signup" onSubmit={handleSubmit}>
              <input
                className="input-field"
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="primary-btn">Subscribe Now</button>
            </form>
            {message && (
              <p className="status-message" aria-live="polite">{message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;