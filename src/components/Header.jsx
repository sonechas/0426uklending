import React, { useState, useEffect, useRef } from "react";
import "../css/Header.css";
import { FaCaretDown } from "react-icons/fa";
import DropdownMenu from "../ui/DropdownMenu";
import { Link, useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import logo from "../UKLLong.png";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const menuItems = [
    { label: "Bridging Finance", link: "/bridging-finance#steps-row" },
    { label: "Buy to Let", link: "/buy-to-let#steps-row" },
    { label: "Residential Mortgages", link: "/residential-mortgages#steps-row" },
    { label: "Commercial Mortgages", link: "/commercial-mortgages#steps-row" },
    { label: "First Time Buyers", link: "/first-time-buyers#steps-row" },
    { label: "Urgent Remortgage", link: "/urgent-remortgage#steps-row" },
  ];

  const messages = [
    "Get the Best Property Financing – 100% Fee-Free Brokerage.",
    "Bridging Finance Made Simple – No Hidden Fees!",
    "Secure the Best Mortgage Rates – Fast & Transparent.",
    "Invest in Property with Zero Brokerage Fees!",
    "Your Property Financing, Our Expertise – Always Fee-Free.",
    "Find the Right Mortgage – Fast, Simple and Free!",
    "No Broker Fees. No Hassle. Just the Best Rates!",
    "Financing That Works for You – With Zero Fees!",
    "Compare Lenders & Save – 100% Free Brokerage Service!",
    "Find the Best Mortgage Deals – 100% Transparent, No Extra Fees!",
    "Smart Property Financing – No Fees, No Delays, Just the Best Rates!",
    "Get the Right Loan, the Right Way – Always Fee-Free!",
    "Unlock Better Mortgage Rates – No Costs, No Complications!",
    "Bridging Loans Made Easy – Fast, Flexible & Fee-Free!",
    "Your Property. Your Investment. Our Expertise. Zero Fees!",
    "Seamless Property Financing – Compare, Choose and Save!",
    "No Commission, No Hidden Charges – Just the Best Mortgage Deals!",
    "Hassle-Free Property Financing – No Broker Fees, Just Results!",
    "Unlock Property Investment Opportunities – 100% Free Brokerage!",
    "Smarter Home Financing – The Best Deals Without the Fees!",
    "Save Thousands on Brokerage Fees – Get the Best Rates for Free!",
    "Transparent Mortgage Solutions – No Fees, No Surprises!",
    "Maximise Your Property Investment – Pay Zero Brokerage Fees!",
    "Compare the Market, Find the Best Rate – Completely Free!",
    "Bridging Loans & Mortgages – No Fees, No Hassle, Just Savings!",
    "Your Mortgage, Your Terms – No Fees, No Delays!",
    "Home Loans Without the Extra Costs – 100% Fee-Free Brokerage!",
    "Finance Your Dream Property – Fast, Simple and No Broker Fees!",
    "We Work for You, Not the Lenders – That’s Why It’s Free!"
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [shouldScroll, setShouldScroll] = useState(false);
  const tickerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (tickerRef.current && wrapperRef.current) {
        setShouldScroll(tickerRef.current.scrollWidth > wrapperRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [messageIndex]);

  useEffect(() => {
    if (shouldScroll) {
      const duration = 20 * 1000;
      const timeout = setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, duration);
      return () => clearTimeout(timeout);
    } else {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [shouldScroll, messageIndex]);

  return (
    <>
      <div className="top-header">
        <div className="ticker-wrapper" ref={wrapperRef}>
          <span
            id="rotating-text"
            className="ticker-text"
            ref={tickerRef}
            style={shouldScroll ? { animation: "ticker-scroll 20s linear infinite" } : {}}
          >
            {messages[messageIndex]}
          </span>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <Link className="logo" to="/">
            <img src={logo} alt="UK Lending Logo" className="logo-img" />
          </Link>
          <div
            className={`toggle-btn ${menuOpen ? "toggle-open" : ""}`}
            onClick={toggleMenu}
          ></div>
          <nav className={menuOpen ? "nav nav-show" : "nav"}>
            <ul>
              <li>
                <DropdownMenu
                  icon={<FaCaretDown />}
                  menuItems={menuItems}
                  selectText="Services"
                  className="custom-dropdown"
                  onMenuItemClick={closeMenu}
                />
              </li>
              <li><Link to="/faqs" className="nav-link-item" onClick={closeMenu}>FAQs</Link></li>
              <li><Link to="/blog" className="nav-link-item" onClick={closeMenu}>Blogs</Link></li>
              <li><Link to="/fixed-rate-reminder" className="nav-link-item" onClick={closeMenu}>Fixed Rate Reminder</Link></li>
              {menuOpen && (
                <li className="get-started-item">
                  <Link to="/configure" className="get-started-btn">Request Callback</Link>
                </li>
              )}
            </ul>
          </nav>
          <div className="btn-wrapper dmb">
            <Link to="/configure" className="primary-btn">Request Callback</Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;