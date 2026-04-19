import React, { useEffect } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  
} from "react-icons/fa";
import "../css/Footer.css";
import { Link, useLocation } from "react-router-dom";
import { animateScroll as scroller } from 'react-scroll';
import logo from "../UKLLong.png";


const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      scroller.scrollTo(hash.replace("#", ""), {
        duration: 500,
        smooth: true,
        offset: -50, // Adjust as needed to fine-tune the scroll position
      });
    }
  }, [location]);

  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="container">
          <Link to="/" className="logo">
            <img src={logo} alt="UK Lending Logo" className="logo-img" />
          </Link>
          <div className="footer-content">
            <div className="link-list program-list">
              <h4>Services</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/bridging-finance#footer">Bridging Finance</Link>
                </li>
                <li>
                  <Link to="/buy-to-let#footer">Buy to Let</Link>
                </li>
                <li>
                  <Link to="/residential-mortgages#footer">Residential Mortgages</Link>
                </li>
                <li>
                  <Link to="/commercial-mortgages#footer">Commercial Mortgages</Link>
                </li>
                <li>
                  <Link to="/first-time-buyers#footer">First Time Mortgages</Link>
                </li>
                <li>
                  <Link to="/urgent-remortgage#footer">Urgent Remortgage</Link>
                </li>
              </ul>
            </div>
            <div className="link-list">
              <h4>Company</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/faqs#footer">FAQs</Link>
                </li>
                <li>
                  <Link to="/blog#footer">Blog</Link>
                </li>
                <li>
                  <Link to="/configure#footer">Request Callback</Link>
                </li>
                <li>
                  <Link to="/fixed-rate-reminder#footer">Fixed Rate Reminder</Link>
                </li>
              </ul>
            </div>
            <div className="link-list social-list">
              <h4>Social</h4>
              <ul className="footer-links">
                <li>
                  <a href="https://www.facebook.com/people/Lending-Company/61575609243471/">
                    <FaFacebookF className="icon" />
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/lending.company/">
                    <FaInstagram className="icon" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/lending_company">
                    <FaTwitter className="icon" />
                    <span>Twitter</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@thelendingcompany">
                    <FaTiktok className="icon" />
                    <span>Tiktok</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="link-list connect-list">
              <h4>Contact</h4>
              <ul className="footer-links">
                <li>
                  <a href="tel:+123456789">
                    <FaPhone className="icon" />
                    <span>+44 20 4538 9255</span>
                  </a>
                </li>
                <li>
                  <a href="mailto: ">
                    <FaEnvelope className="icon" />
                    <span>info@uklending.london</span>
                  </a>
                </li>
                <li>
                  <a href="/">
                    <FaMapMarkerAlt className="icon" />
                    <span>
                      One Canada Square, TOG 8th Floor, Canary Wharf, London E14
                      5AA
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-btm">
        <span>
        © 2026 UK Lending. All Rights Reserved. UK Lending FCA number: 918885.
        </span>
      </div>
    </footer>
  );
};

export default Footer;