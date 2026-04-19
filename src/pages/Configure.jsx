import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCaretRight } from "react-icons/fa";
import Hero from "../components/Hero";
import QualitySection from "../components/QualitySection";
import NewsletterSection from "../components/NewsletterSection";
import LoanImage from "../assets/loan-img.webp";
import backgroundImage1 from "../assets/palace-1366178.webp"; // Import the image for QualitySection
import "../css/FormStyles.css";
import "../css/Configure.css"; // Import your CSS file for styling
import { BASE_URL } from "../services/apiService";
const Configure = () => {
  const [formData, setFormData] = useState({
    service: "",
    fullName: "",
    contactInfo: "",
    dob: "",
    ownershipType: "",
    companyName: "",
    mortgageName: "",
    jointMortgageNames: "",
    limitedTimeOffer: "",
    notes: "",
  });

  const location = useLocation();
  const lender = location.state?.lender; // Retrieving state passed via Link
  const searchParams = new URLSearchParams(location.search);
  const productCode = searchParams.get("product");

  const [contactMethod, setContactMethod] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownMultipleProperties, setOwnMultipleProperties] = useState("");

  const [bestTimeToCall, setBestTimeToCall] = useState("");
  const [otherDate, setOtherDate] = useState("");
  const [otherDateTimeSlot, setOtherDateTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [otherDates, setOtherDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    console.log("Lender Data:", lender); // Debugging: Check if data is coming correctly
  }, [lender]);

  useEffect(() => {
    generateTimeSlots();
    generateOtherDates();

      // Read prefill parameters from URL
  const contactMethodParam = searchParams.get("contactMethod");
  const serviceParam = searchParams.get("service");
  const ownMultiplePropertiesParam = searchParams.get("ownMultipleProperties");

  if (contactMethodParam) setContactMethod(contactMethodParam);
  if (serviceParam) {
    setFormData(prev => ({
      ...prev,
      service: serviceParam
    }));
  }
  if (ownMultiplePropertiesParam) {
    setOwnMultipleProperties(ownMultiplePropertiesParam);
  }
  }, []);  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTimeSlots = () => {
    const today = new Date();
    let currentDay = today.getDay();
    let currentHour = today.getHours();
    let currentMinute = today.getMinutes();
  
    const officeHours = {
      1: { start: 9, end: 21 },
      2: { start: 9, end: 21 },
      3: { start: 9, end: 21 },
      4: { start: 9, end: 21 },
      5: { start: 9, end: 21 },
      6: { start: 9, end: 18 },
    };
  
    const getNextAvailableDay = (day) => {
      let nextDay = day;
      let daysChecked = 0;
      while (daysChecked < 7) {
        nextDay = (nextDay + 1) % 7;
        if (nextDay !== 0 && officeHours[nextDay]) return nextDay;
        daysChecked++;
      }
      return null;
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
  };
  
  const generateOtherDates = () => {
    let today = new Date();
    let dates = [];
    let daysAdded = 0;
    while (dates.length < 7 && daysAdded < 14) {
      today.setDate(today.getDate() + 1);
      if (today.getDay() !== 0) {
        dates.push(formatDate(today));
      }
      daysAdded++;
    }
    setOtherDates(dates);
  };
  
  const generateTimeSlotsForDate = (selectedDateString) => {
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
      slots = [
        "9:00 AM - 11:00 AM",
        "11:00 AM - 1:00 PM",
        "1:00 PM - 3:00 PM",
        "3:00 PM - 5:00 PM",
        "5:00 PM - 7:00 PM",
        "7:00 PM - 9:00 PM",
      ];
    } else if (dayOfWeek === 6) {
      slots = [
        "9:00 AM - 11:00 AM",
        "11:00 AM - 1:00 PM",
        "1:00 PM - 3:00 PM",
        "3:00 PM - 5:00 PM",
        "5:00 PM - 7:00 PM",
      ];
    }
  
    return slots;
  };
  
  const formatTime = (hour, minute = 0) => {
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    return `${adjustedHour}:${formattedMinute} ${period}`;
  };
  
  const formatDate = (date) => {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const suffix =
      dateNum === 1 || dateNum === 21 || dateNum === 31 ? "st"
      : dateNum === 2 || dateNum === 22 ? "nd"
      : dateNum === 3 || dateNum === 23 ? "rd"
      : "th";
    return `${day} ${dateNum}${suffix} ${month}`;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const API_URL = `${BASE_URL}/submit-loan-application`;
    const cleanedData = {
      ...formData,
      contactInfo: formData.contactInfo,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setMessage("✅ Loan enquiry submitted successfully!");
        setFormData({
          service: "",
          fullName: "",
          contactInfo: "",
          dob: "",
          ownershipType: "",
          companyName: "",
          mortgageName: "",
          jointMortgageNames: "",
          limitedTimeOffer: "",
          notes: "",
          bestTimeToCall: "",
          otherDate: "",
          otherDateTimeSlot: "",

        });
        setContactMethod("");
        setOwnershipType("");
      } else {
        setMessage("❌ Submission failed. Please try again.");
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
        title="Apply for Your Loan or Mortgage with Confidence"
        subHeading="UK Lending – Your Trusted Partner in Financing"
        detail="We offer tailored loan and mortgage solutions to help you achieve your dreams. Our process is simple, transparent, and secure."
        className="hero-2"
        imageUrl={LoanImage}
      />


      {lender ? (
        <div className="loan-details-container">
          <div className="loan-details">
            <h2 className="loan-title">Loan Details</h2>
            <table className="loan-table">
              <thead>
                <tr>
                  <th>Product Fee</th>
                  <th>Monthly Cost</th>
                  <th>Total Cost</th>
                  <th>Lender Name</th>
                  <th>Interest Rate</th>
                  <th>Rate Type</th>
                  <th>Initial Period</th>
                  <th>Revert Rate</th>
                  <th>Valuation Fee (Est.)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{lender.fee || "N/A"}</td>
                  <td>{lender.monthlyCost || "N/A"}</td>
                  <td>{lender.totalCost || "N/A"}</td>
                  <td>{lender.name || "N/A"}</td>
                  <td>{lender.rate ? `${lender.rate}` : "N/A"}</td>
                  <td>{lender.mortgageClass || "N/A"}</td>
                  <td>
                    {lender.initialRatePeriodMonths ? `${lender.initialRatePeriodMonths} months` : "N/A"}
                    {lender.ltv ? ` (${lender.ltv})` : ""}
                  </td>
                  <td>{lender.standardVariableRate ? `${lender.standardVariableRate}` : "N/A"}</td>
                  <td>{lender.valuationFee || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        ) : productCode ? (
          <p className="loading-message">
            <span className="loading-icon">⏳</span> Loading loan details for Product Code: {productCode}...
          </p>
        ) : null}







      <div className="form-section-wrapper">
        <div className="form-info-side">
          <h2 className="ultra-heading">
            LET’S BUILD <br /> YOUR FUTURE.
          </h2>
          <p className="form-desc-large">
            Whether you’re exploring new property horizons or bridging a gap in your portfolio, 
            our expert advisors are ready to help you navigate the complexities of property finance.
          </p>
          <div className="contact-details-minimal">
            <div className="contact-item">
              <span className="contact-label">EMAIL US</span>
              <span className="contact-value">info@uklending.london</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">CALL US</span>
              <span className="contact-value">+44 20 4538 9255</span>
            </div>
          </div>
        </div>

        <div className="form-box-modern">
          {message && <p className="submission-message">{message}</p>}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-section">
              <span className="section-label">HOW CAN WE HELP?</span>
              <div className="chip-group">
                {["Bridging", "Buy to Let", "Residential Mortgage", "Commercial Mortgage", "Other"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip-btn ${formData.service === s ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, service: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <span className="section-label">HOW SHOULD WE REACH YOU?</span>
              <div className="chip-group">
                {["Phone", "Email"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`chip-btn ${contactMethod === m ? "active" : ""}`}
                    onClick={() => setContactMethod(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {formData.service === "Buy to Let" && (
              <div className="form-section fade-in-section">
                <span className="section-label">PORTFOLIO DETAILS</span>
                <p className="section-subtext">Own more than 3 buy-to-let properties?</p>
                <div className="chip-group">
                  {["Yes", "No"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`chip-btn small ${ownMultipleProperties === v ? "active" : ""}`}
                      onClick={() => setOwnMultipleProperties(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group-modern">
                <input
                  className="modern-input"
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {contactMethod && (
                <div className="form-group-modern">
                  <input
                    className="modern-input"
                    type="text"
                    name="contactInfo"
                    placeholder={contactMethod === "Phone" ? "Phone Number" : "Email Address"}
                    value={formData.contactInfo}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group-modern">
                <input className="modern-input" type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                <span className="input-helper">Date of Birth</span>
              </div>

              <div className="form-group-modern">
                <select className="modern-input" name="ownershipType" value={ownershipType} onChange={(e) => setOwnershipType(e.target.value)} required>
                  <option value="">Ownership Type</option>
                  <option value="Limited Company">Limited Company</option>
                  <option value="Personal - Single">Personal - Single</option>
                  <option value="Personal - Joint">Personal - Joint</option>
                </select>
              </div>
            </div>

            {ownershipType && (
              <div className="form-group-modern full-width">
                <input
                  className="modern-input"
                  type="text"
                  name={
                    ownershipType === "Limited Company"
                      ? "companyName"
                      : ownershipType === "Personal - Single"
                      ? "mortgageName"
                      : "jointMortgageNames"
                  }
                  placeholder={ownershipType === "Limited Company" ? "Company Name" : "Name(s) on Mortgage"}
                  value={
                    formData[
                      ownershipType === "Limited Company"
                        ? "companyName"
                        : ownershipType === "Personal - Single"
                        ? "mortgageName"
                        : "jointMortgageNames"
                    ]
                  }
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button type="submit" className="modern-submit-btn">
              {loading ? "SENDING..." : "SEND ENQUIRY"}
            </button>
          </form>
          <p className="legal-statement">Your home may be repossessed if you do not keep up repayments on your mortgage.</p>
        </div>
      </div>

      <QualitySection
        preHeader="Tailored to Meet Urgent Needs"
        mainHeading="Flexible Financing for Immediate Property Needs"
        description="Our remortgage solutions are crafted for property owners needing fast, flexible capital. Whether you’re managing a switch to a better deal or need to release equity, our team offers support at every stage. With transparent terms and a focus on quick processing, we ensure you get the right remortgage solution for your needs."
        buttonText="Get Started"
        buttonLink="/"
        backgroundImage={backgroundImage1}
      />

      <NewsletterSection />
    </>
  );
};

export default Configure;
