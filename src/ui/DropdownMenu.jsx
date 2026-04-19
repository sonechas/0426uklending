import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "../css/DropdownMenu.css";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const SERVICE_DESCRIPTIONS = {
  "Bridging Finance":       "Short-term lending to bridge your property gap",
  "Buy to Let":             "Expert advice to maximise your rental investment",
  "Residential Mortgages":  "The best rate secured for your next home",
  "Commercial Mortgages":   "Finance for offices, retail & mixed-use property",
  "First Time Buyers":      "Step confidently onto the property ladder",
  "Urgent Remortgage":      "Beat your fixed-rate deadline — we move fast",
};

const DropdownMenu = ({
  menuItems,
  selectText = "Services",
  className = "",
  onMenuItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [panelTop, setPanelTop] = useState(87);
  const dropdownRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Measure the real bottom edge of .header and keep it in sync.
  // We use a portal to render the panel outside .header's stacking
  // context (backdrop-filter creates one), so position:fixed works
  // correctly relative to the viewport.
  useEffect(() => {
    const updateTop = () => {
      const header = document.querySelector(".header");
      if (header) {
        setPanelTop(header.getBoundingClientRect().bottom);
      }
    };

    updateTop();

    const header = document.querySelector(".header");
    const ro = new ResizeObserver(updateTop);
    if (header) ro.observe(header);
    window.addEventListener("resize", updateTop);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateTop);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const closeDropdown = () => {
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 180); // matches megaSlideUp duration
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close if click is outside the trigger AND outside the portal panel
      const panel = document.getElementById("mega-panel-portal");
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        panel &&
        !panel.contains(e.target)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = () => {
    if (onMenuItemClick) onMenuItemClick();
    closeDropdown();
  };

  const panel = (isOpen || isClosing)
    ? ReactDOM.createPortal(
        <div
          id="mega-panel-portal"
          className={`mega-panel${isClosing ? " mega-panel--closing" : ""}`}
          role="menu"
          style={{ top: `${panelTop}px` }}
        >
          <div className="mega-panel__inner">
            <ul className="mega-grid">
              {menuItems.map((item, index) => {
                const desc = SERVICE_DESCRIPTIONS[item.label] || "";
                return (
                  <li key={index} className="mega-grid__item">
                    <Link
                      className="mega-grid__link"
                      to={item.link}
                      onClick={handleItemClick}
                      role="menuitem"
                    >
                      <span className="mega-grid__text">
                        <span className="mega-grid__name">{item.label}</span>
                        {desc && (
                          <span className="mega-grid__desc">{desc}</span>
                        )}
                      </span>
                      <FaChevronRight className="mega-grid__arrow" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className={`mega-dropdown ${className}`} ref={dropdownRef}>
        <button
          className={`mega-trigger ${isOpen ? "mega-trigger--open" : ""}`}
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {selectText}
          <FaChevronDown
            className={`mega-trigger__caret ${isOpen ? "mega-trigger__caret--up" : ""}`}
          />
        </button>
      </div>
      {panel}
    </>
  );
};

DropdownMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectText: PropTypes.string,
  className: PropTypes.string,
  onMenuItemClick: PropTypes.func,
  icon: PropTypes.element,
};

export default DropdownMenu;