import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import Logo1 from "../assets/development-finance.webp";
import Logo2 from "../assets/development-finance.webp";

const lenders = [
  {
    logo: Logo1,
    name: "MS Lending Group",
    rate: "0.95% - 1.05%",
    ltv: "LTV 50.0%",
    fee: "£500",
    monthlyCost: "£242 - £268",
    totalCost: "£26,954 - £27,107",
  },
  {
    logo: Logo2,
    name: "Affirmative",
    rate: "1.00% - 1.50%",
    ltv: "LTV 50.0%",
    fee: "£500",
    monthlyCost: "£255 - £383",
    totalCost: "£27,030 - £27,795",
  },
];

const LoanResults = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Lender");
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    propertyType: "",
    location: "",
    interestCalculation: "",
    greenProducts: "",
  });

  const handleFilterClick = (filter) => {
    setSelectedSort(filter);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setFilterOpen(!isFilterOpen);
  };

  const handleOptionChange = (category, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  return (
    <section className="loan-comparison">
      <div className="container">
        <div className="lender-results">
          <h2>WE'VE FOUND <span>2 LENDERS</span> THAT MATCH YOUR SEARCH.</h2>

          <div className="filter-sort">
            <div className="filter-dropdown">
              <button className="filter-btn" onClick={toggleDropdown}>
                FILTER <span>&#9776;</span>
              </button>
              {isFilterOpen && (
                <div className="filter-options">
                  <div>
                    <h4>Property Type</h4>
                    <label>
                      <input
                        type="radio"
                        name="propertyType"
                        value="Residential"
                        checked={selectedOptions.propertyType === "Residential"}
                        onChange={() => handleOptionChange("propertyType", "Residential")}
                      />{" "}
                      Residential
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="propertyType"
                        value="Commercial"
                        checked={selectedOptions.propertyType === "Commercial"}
                        onChange={() => handleOptionChange("propertyType", "Commercial")}
                      />{" "}
                      Commercial
                    </label>
                    {/* Add other options similarly */}
                  </div>
                </div>
              )}
            </div>

            <div>
              <span className="filter-text">Sort By</span>
              <div className="sort-dropdown-col" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                <span className="dp-trigger">
                  {selectedSort} <FaCaretDown />
                </span>
                <div className={`sort-dropdown ${isDropdownOpen ? "open" : ""}`}>
                  <div className="dropdown-link-item" onClick={() => handleFilterClick("Lender")}>
                    Lender
                  </div>
                  <div className="dropdown-link-item" onClick={() => handleFilterClick("Rate")}>
                    Rate
                  </div>
                  {/* Add other sorting options */}
                </div>
              </div>
            </div>
          </div>

          <div className="lender-list">
            {lenders.map((lender, index) => (
              <div key={index} className="lender-item">
                <div className="lender-logo">
                  <img src={lender.logo} alt={lender.name} />
                </div>
                <div className="rate-col">
                  <p>{lender.rate}</p>
                  <p>{lender.ltv}</p>
                </div>
                <p>{lender.fee}</p>
                <p>{lender.monthlyCost}</p>
                <p>{lender.totalCost}</p>
                <div className="more-col">
                  <button className="secondry-btn">Continue</button>
                  <p className="lender-info">Lender Info</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanResults;
