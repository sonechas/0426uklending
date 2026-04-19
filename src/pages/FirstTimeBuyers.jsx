import React, { useState, useEffect, useRef } from "react";
import { FaCaretRight } from "react-icons/fa";
import Hero from "../components/Hero";
import CtaSection from "../components/CtaSection";
import QualitySection from "../components/QualitySection";
import NewsletterSection from "../components/NewsletterSection";
import "../css/ProgramPage.css";
import "../css/commercialmortgages.css";
import "../css/FormStyles.css";
import { BASE_URL } from "../services/apiService";

import FirstTimeBuyersLoan from "../assets/architecture-3121009.webp";
import CtaImg1 from "../assets/palace-1366178.webp";
import CtaImg2 from "../assets/building-img.webp";
import CtaImg3 from "../assets/loan-img.webp";
import CtaImg4 from "../assets/building-img2.webp";
import backgroundImage from "../assets/palace-1366178.webp";

const TypingText = () => {
  const fullMessageList = [
    ["First-Time Buyer?", "Zero Broker Fees."],
    ["Get on the Property Ladder.", "Without Broker Fees."],
    ["Homeownership Starts Here.", "With 0% Broker Fees."],
    ["Buying Your First Home?", "We Don't Charge Fees."],
    ["Simple Mortgage Advice.", "No Broker Charges."],
    ["You Pay for Property.", "Not for Brokerage."],
    ["We Work for You.", "Not for Broker Fees."],
    ["100% Transparent.", "Always Fee-Free."],
    ["Expert Support.", "Zero Broker Charges."],
    ["Let’s Get Your Home.", "No Broker Fees."]
  ];

  const getRandomMessage = () => fullMessageList[Math.floor(Math.random() * fullMessageList.length)];

  const [currentMessage, setCurrentMessage] = useState(getRandomMessage());
  const [displayedText, setDisplayedText] = useState(["", ""]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);
  const [fontSize, setFontSize] = useState(1.5);
  const [maxFontSize, setMaxFontSize] = useState(1.5);

  const containerRef = useRef(null);
  const lineRefs = [useRef(null), useRef(null)];

  const updateMaxFontSize = () => {
    const screenWidth = window.innerWidth;
    const maxSize = screenWidth >= 1500 ? 3.0 : 1.5;
    setMaxFontSize(maxSize);
    setFontSize(maxSize);
  };

  const adjustFontSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 1150) return;

    if (!containerRef.current || !lineRefs[0].current || !lineRefs[1].current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const lineWidths = lineRefs.map((ref) => ref.current.offsetWidth);
    const maxWidth = Math.max(...lineWidths);

    if (maxWidth > containerWidth && fontSize > 1.0) {
      setFontSize((prev) => parseFloat((prev - 0.1).toFixed(2)));
    }
  };

  useEffect(() => {
    updateMaxFontSize();
    window.addEventListener("resize", updateMaxFontSize);
    return () => window.removeEventListener("resize", updateMaxFontSize);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => adjustFontSize(), 100);
    return () => clearTimeout(timeout);
  }, [displayedText]);

  useEffect(() => {
    if (pause) return;

    const currentLineText = currentMessage[lineIndex];
    let timeout;

    if (!isDeleting) {
      if (charIndex <= currentLineText.length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => {
            const updated = [...prev];
            updated[lineIndex] = currentLineText.substring(0, charIndex);
            return updated;
          });
          setCharIndex((prev) => prev + 1);
        }, 50);
      }

      if (charIndex > currentLineText.length) {
        if (lineIndex < currentMessage.length - 1) {
          setCharIndex(0);
          setLineIndex((prev) => prev + 1);
        } else {
          setPause(true);
          setTimeout(() => {
            setIsDeleting(true);
            setPause(false);
            setCharIndex(currentLineText.length);
          }, 20000);
        }
      }
    } else {
      if (charIndex >= 0) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => {
            const updated = [...prev];
            updated[lineIndex] = currentLineText.substring(0, charIndex);
            return updated;
          });
          setCharIndex((prev) => prev - 1);
        }, 40);
      }

      if (charIndex < 0) {
        if (lineIndex > 0) {
          setLineIndex((prev) => prev - 1);
          setCharIndex(currentMessage[lineIndex - 1].length);
        } else {
          setIsDeleting(false);
          setCharIndex(0);
          setLineIndex(0);
          setCurrentMessage(getRandomMessage());
          setFontSize(maxFontSize);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex, isDeleting, pause, currentMessage]);

  return (
    <div className="typing-container" ref={containerRef} style={{ fontSize: `${fontSize}rem` }}>
      <div className="typing-line" ref={lineRefs[0]}>
        {displayedText[0]}
        {lineIndex === 0 && <span className="blinking-cursor">|</span>}
      </div>
      <div className="typing-line" ref={lineRefs[1]}>
        {displayedText[1]}
        {lineIndex === 1 && <span className="blinking-cursor">|</span>}
      </div>
    </div>
  );
};

const animationStyle = `
  .typing-container {
    position: absolute;
    top: 40%;
    left: 80%;
    transform: translate(-50%, -50%);
    font-weight: 770;
    color: #ffffff;
    z-index: 9;
    pointer-events: none;
    text-align: center;
    line-height: 1.4;
    max-width: 40vw;
  }

  .typing-line {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .blinking-cursor {
    font-weight: 100;
    font-size: 1em;
    color: white;
    animation: blink 1s infinite;
    margin-left: 5px;
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }

  @media screen and (max-width: 1149px) {
    .typing-container {
      display: none;
    }
  }
`;

const FirstTimeBuyers = () => {
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
      //http://localhost:3000/
      //${BASE_URL}
      const response = await fetch(`${BASE_URL}/first-time-buyers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "FirstTimeBuyer",
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
      <style>{animationStyle}</style>
      <div style={{ position: "relative" }}>
        <Hero
          title="First-Time Buyer Mortgages – Step into Your First Home"
          subHeading="Making Homeownership a Reality for First-Time Buyers"
          detail="Navigating the mortgage process as a first-time buyer can be overwhelming. We provide expert guidance and tailored solutions to help you secure your first home with confidence."
          className="hero-1"
          imageUrl={FirstTimeBuyersLoan}
          id="hero"
        />
        <TypingText />
      </div>

      {/* Form Section */}
      <div className="form-section-wrapper">
        <div className="form-info-side">
          <h2 className="ultra-heading">
            STEP ONTO THE<br />PROPERTY LADDER.
          </h2>
          <p className="form-desc-large">
            Getting your first mortgage doesn't have to be daunting. Our fee-free advisors are here to guide you through every step — from eligibility checks to keys in hand.
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

      <QualitySection
        preHeader="Helping First-Time Buyers Every Step of the Way"
        mainHeading="Your Journey to Homeownership Starts Here"
        description="At The Mortgage Group, we simplify the mortgage process for first-time buyers. From mortgage pre-approval to finalizing your loan, our expert advisors ensure you get the best mortgage deal suited to your financial situation. We offer flexible solutions, competitive rates, and personalized advice to make your homeownership journey stress-free."
        backgroundImage={backgroundImage}
      />

      <CtaSection
        ctaDirection="reverse light"
        ctaHeading="Why Choose Our First-Time Buyer Mortgage Services"
        ctaParagraph="Buying your first home is a major milestone, and we're here to make the process easier. Our mortgage solutions are designed specifically for first-time buyers, offering low deposit options, government-backed schemes, and expert guidance throughout the journey."
        ctaImg1={CtaImg3}
        ctaImg2={CtaImg4}
        altText1="Front Image Description"
        altText2="Back Image Description"
        id="cta-1"
      />

      <CtaSection
        ctaDirection=""
        ctaHeading="Our Commitment to First-Time Buyers"
        ctaParagraph="We understand the challenges of getting onto the property ladder, which is why we provide straightforward mortgage solutions, helping you secure your first home with ease. Whether you're using a government Help-to-Buy scheme or need advice on deposit options, our experts are here to guide you."
        ctaImg1={CtaImg1}
        ctaImg2={CtaImg2}
        altText1="Front Image Description"
        altText2="Back Image Description"
        btnClass="secondry-btn"
        id="cta-2"
      />

      <NewsletterSection id="newsletter" />
    </>
  );
};

export default FirstTimeBuyers;