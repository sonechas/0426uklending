import React, { useState, useEffect } from "react";
import { FaCaretRight } from "react-icons/fa";
// import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CtaSection from "../components/CtaSection";
import QualitySection from "../components/QualitySection";
import NewsletterSection from "../components/NewsletterSection";
import { BASE_URL } from "../services/apiService";

// Assets
import commercialFinance from "../assets/development-finance.webp";
import backgroundImage from "../assets/palace-1366178.webp";
import CtaImg1 from "../assets/building-img.webp";
import CtaImg2 from "../assets/building-img2.webp";
import CtaImg3 from "../assets/palace-1366178.webp";
import CtaImg4 from "../assets/lending-bg-1.webp";

import "../css/commercialmortgages.css";
import "../css/FormStyles.css";

const CommercialMortgages = () => {
  const [contactMethod, setContactMethod] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bestTimeToCall, setBestTimeToCall] = useState("");
  const [otherDate, setOtherDate] = useState("");
  const [otherDateTimeSlot, setOtherDateTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [otherDates, setOtherDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    generateTimeSlots();
    generateOtherDates();
  }, []);

  // Generate 6 available time slots dynamically
  function generateTimeSlots() {
    const today = new Date();
    let currentDay = today.getDay();
    let currentHour = today.getHours();
    let currentMinute = today.getMinutes();

    const officeHours = {
      1: { start: 9, end: 21 }, // Monday
      2: { start: 9, end: 21 }, // Tuesday
      3: { start: 9, end: 21 }, // Wednesday
      4: { start: 9, end: 21 }, // Thursday
      5: { start: 9, end: 21 }, // Friday
      6: { start: 9, end: 18 }, // Saturday
    };

    const getNextAvailableDay = (day) => {
      let nextDay = day;
      let daysChecked = 0;
      while (daysChecked < 7) {
        nextDay = (nextDay + 1) % 7;
        if (nextDay !== 0 && officeHours[nextDay]) {
          // Skip Sunday
          return nextDay;
        }
        daysChecked++;
      }
      return null; // No available day found
    };

    const prepTimeInMinutes = 30;
    let adjustedMinutes = currentMinute + prepTimeInMinutes;
    let adjustedHour = currentHour;

    if (adjustedMinutes >= 60) {
      adjustedHour += 1;
      adjustedMinutes -= 60;
    }

    let startHour = Math.max(adjustedHour, officeHours[currentDay]?.start || 0);
    let startMinute = adjustedMinutes > 0 ? 30 : 0;
    let slots = [];
    let daysGenerated = 0;
    while (slots.length < 6 && daysGenerated < 7) {
      if (!officeHours[currentDay]) {
        currentDay = getNextAvailableDay(currentDay);
        if (currentDay === null) break;
        today.setDate(today.getDate() + ((currentDay - today.getDay() + 7) % 7));
        startHour = officeHours[currentDay].start;
        startMinute = 0;
        daysGenerated++;
        continue;
      }

      if (startHour + 2 <= officeHours[currentDay].end) {
        const slotStartFormatted = formatTime(startHour, startMinute);
        const slotEndFormatted = formatTime(startHour + 2, 0);
        slots.push(`${formatDate(today)}, ${slotStartFormatted} - ${slotEndFormatted}`);
        startHour += 2;
        startMinute = 0;
      } else {
        currentDay = getNextAvailableDay(currentDay);
        if (currentDay === null) break;
        today.setDate(today.getDate() + ((currentDay - today.getDay() + 7) % 7));
        startHour = officeHours[currentDay].start;
        startMinute = 0;
        daysGenerated++;
      }
    }
    setTimeSlots(slots);
  }

  // Generate the next 7 available dates
  function generateOtherDates() {
    let today = new Date();
    let dates = [];
    let daysAdded = 0;
    while (dates.length < 7 && daysAdded < 14) {
      // prevent infinite loop
      today.setDate(today.getDate() + 1);
      if (today.getDay() !== 0) {
        // Skip Sunday
        dates.push(formatDate(today));
      }
      daysAdded++;
    }
    setOtherDates(dates);
  }

  function formatTime(hour, minute = 0) {
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    return `${adjustedHour}:${formattedMinute} ${period}`;
  }

  function formatDate(date) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const suffix =
      dateNum === 1 || dateNum === 21 || dateNum === 31
        ? "st"
        : dateNum === 2 || dateNum === 22
        ? "nd"
        : dateNum === 3 || dateNum === 23
        ? "rd"
        : "th";
    return `${day} ${dateNum}${suffix} ${month}`;
  }

  // Function to generate time slots for a given date
  function generateTimeSlotsForDate(selectedDateString) {
    // Try to parse the day name from the string
    const dayName = selectedDateString.split(" ")[0];
    const dayMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const dayOfWeek = dayMap[dayName];
    let slots = [];

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Monday - Friday
      slots = [
        "9:00 AM - 11:00 AM",
        "11:00 AM - 1:00 PM",
        "1:00 PM - 3:00 PM",
        "3:00 PM - 5:00 PM",
        "5:00 PM - 7:00 PM",
        "7:00 PM - 9:00 PM",
      ];
    } else if (dayOfWeek === 6) {
      // Saturday
      slots = [
        "9:00 AM - 11:00 AM",
        "11:00 AM - 1:00 PM",
        "1:00 PM - 3:00 PM",
        "3:00 PM - 5:00 PM",
        "5:00 PM - 7:00 PM",
      ];
    }

    return slots;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "otherDate") {
      setOtherDate(value);
      const generatedSlots = generateTimeSlotsForDate(value);
      setAvailableTimeSlots(generatedSlots);
      setOtherDateTimeSlot(""); // Reset selected time slot
      return;
    }

    if (name === "otherDateTimeSlot") {
      setOtherDateTimeSlot(value);
      return;
    }

    if (name === "bestTimeToCall") {
      setBestTimeToCall(value);
      if (value !== "Other") {
        setOtherDate("");
        setAvailableTimeSlots([]);
        setOtherDateTimeSlot("");
      }
      return;
    }

    if (name === "contactMethod") {
      setContactMethod(value);
      return;
    }

    // Default case: update formData
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!contactMethod) {
      setMessage("❌ Please select a contact method");
      setLoading(false);
      return;
    }

    if (contactMethod === "Phone" && !formData.phoneNumber) {
      setMessage("❌ Phone number is required");
      setLoading(false);
      return;
    }

    if (contactMethod === "Email" && !formData.email) {
      setMessage("❌ Email address is required");
      setLoading(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.dob) {
      setMessage("❌ All fields are required");
      setLoading(false);
      return;
    }

    try {
      //${BASE_URL}
      const response = await fetch(`${BASE_URL}/commercial-mortgages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "commercialMortgages",
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob: formData.dob,
          email: contactMethod === "Email" ? formData.email : "",
          phoneNumber: contactMethod === "Phone" ? formData.phoneNumber : "",
          bestTimeToCall: bestTimeToCall,
          otherDate: otherDate,
          otherDateTimeSlot: otherDateTimeSlot,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage("✅ Request submitted successfully!");
        // Reset form fields if needed
        setFormData({
          firstName: "",
          lastName: "",
          dob: "",
          email: "",
          phoneNumber: "",
        });
        setContactMethod("");
        setBestTimeToCall("");
        setOtherDate("");
        setOtherDateTimeSlot("");
      } else {
        setMessage(`❌ ${result.error || "Submission failed. Please try again."}`);
      }
    } catch (error) {
      setMessage("⚠️ Error submitting form. Please check your internet connection.");
      console.error("❌ Submission error:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <Hero
        title="Commercial Mortgages – Finance for Your Business Needs"
        subHeading="Empowering Business Growth Through Tailored Mortgage Solutions"
        detail="Our Commercial Mortgages offer flexible financing to support your business property investments, helping you achieve long-term growth and stability."
        className="hero-2"
        imageUrl={commercialFinance}
      />

      {/* Form Section */}
      <div className="form-section-wrapper">
        <div className="form-info-side">
          <h2 className="ultra-heading">
            FINANCE YOUR<br />BUSINESS GROWTH.
          </h2>
          <p className="form-desc-large">
            Our FCA-regulated brokers specialise in commercial property finance. Whether you're acquiring, refinancing, or expanding, we'll secure the right deal for your business — fast.
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

        <div className="form-box-modern">
          {message && <p className="submission-message">{message}</p>}
          <form onSubmit={handleSubmit} className="modern-form">

            <div className="form-section">
              <span className="section-label">HOW SHOULD WE REACH YOU?</span>
              <div className="chip-group">
                {["Phone", "Email"].map((m) => (
                  <button key={m} type="button"
                    className={`chip-btn ${contactMethod === m ? "active" : ""}`}
                    onClick={() => setContactMethod(m)}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <span className="section-label">YOUR DETAILS</span>
              <div className="form-grid">
                <div className="form-group-modern">
                  <input className="modern-input" type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group-modern">
                  <input className="modern-input" type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="form-group-modern">
                  <input className="modern-input" type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                  <span className="input-helper">Date of Birth</span>
                </div>
                {contactMethod === "Email" && (
                  <div className="form-group-modern">
                    <input className="modern-input" type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                  </div>
                )}
                {contactMethod === "Phone" && (
                  <div className="form-group-modern">
                    <input className="modern-input" type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                  </div>
                )}
              </div>
            </div>

            {contactMethod === "Phone" && (
              <div className="form-section">
                <span className="section-label">BEST TIME TO CALL</span>
                <div className="form-grid">
                  <div className="form-group-modern">
                    <select name="bestTimeToCall" className="modern-input" value={bestTimeToCall} onChange={handleChange} required>
                      <option value="">Select Time</option>
                      {timeSlots.map((slot, i) => <option key={i} value={slot}>{slot}</option>)}
                      <option value="Other">Other Date</option>
                    </select>
                    <span className="input-helper">Available Slot</span>
                  </div>
                  {bestTimeToCall === "Other" && (
                    <div className="form-group-modern">
                      <select name="otherDate" className="modern-input" value={otherDate} onChange={handleChange} required>
                        <option value="">Select Date</option>
                        {otherDates.map((d, i) => <option key={i} value={d}>{d}</option>)}
                      </select>
                      <span className="input-helper">Preferred Date</span>
                    </div>
                  )}
                  {otherDate && (
                    <div className="form-group-modern">
                      <select name="otherDateTimeSlot" className="modern-input" value={otherDateTimeSlot} onChange={handleChange} required>
                        <option value="">Select Slot</option>
                        {availableTimeSlots.map((s, i) => <option key={i} value={s}>{s}</option>)}
                      </select>
                      <span className="input-helper">Time Slot</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button type="submit" className="modern-submit-btn" disabled={loading}>
              {loading ? "SUBMITTING..." : "GET MY QUOTE"}
            </button>
          </form>
          <p className="legal-statement">Your home may be repossessed if you do not keep up repayments on your mortgage.</p>
        </div>
      </div>

      {/* Quality Section */}
      <QualitySection
        preHeader="Quality and Service You Can Rely On"
        mainHeading="Quality and Service You Can Rely On"
        description="At UK Lending, we understand that every business has unique property needs. Our Commercial Mortgage solutions are tailored to provide the flexibility and support required for business expansion and property investments. With 24/7 access to experienced advisors, we are here to offer the guidance and resources necessary for your success. Your growth is our priority, and we strive to deliver value and reliability with every loan we offer."
        backgroundImage={backgroundImage}
      />

      {/* Why Choose Us Section */}
      <CtaSection
        ctaDirection="reverse light"
        ctaHeading="Why Choose Commercial Mortgages with Us?"
        ctaParagraph="Our Commercial Mortgage solutions are built with your business in mind. We combine industry expertise with a personalised approach, ensuring you receive tailored financing that supports long-term growth. From flexible terms to competitive rates and fast decisions, we help you focus on what matters—scaling your business."
        ctaImg1={CtaImg1}
        ctaImg2={CtaImg2}
        altText1="Business Property Support"
        altText2="Tailored Commercial Loans"
        id="cta-commercial"
      />

      {/* Our Approach Section */}
      <CtaSection
        ctaDirection=""
        ctaHeading="Our Commercial Mortgage Approach"
        ctaParagraph="With a deep understanding of commercial property finance, our team works alongside you to secure funding that aligns with your business goals. We simplify the complex application process, negotiate competitive terms on your behalf, and remain available throughout your journey. At UK Lending, we don't just offer mortgages—we build long-term partnerships focused on growth."
        ctaImg1={CtaImg3}
        ctaImg2={CtaImg4}
        altText1="Commercial Strategy"
        altText2="Client-Focused Lending"
        btnClass="secondry-btn"
        id="cta-commercial-approach"
      />

      <NewsletterSection />
    </>
  );
};

export default CommercialMortgages;