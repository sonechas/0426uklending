
import React, { useState } from "react";
const FilterDropdown = ({ selectedOptions, setSelectedOptions, handleOptionChange, comparetText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(selectedOptions);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // if (comparetText === "Buy-to-let Mortgage") {
  //   programsType = "Buy_To_Let";
  //   setTermUnit("Years");
  // } else if (comparetText === "Residential Mortgages") {
  //   programsType = "Standard";
  //   setTermUnit("Years");
  // } else if (comparetText === "Compare Bridging Loans") {
  //   programsType = "Bridging_Loan";
  //   setTermUnit("Months");
  // }

  const handleTempOptionChange = (category, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSave = () => {
    handleOptionChange(tempFilters); // Pass the temporary filters to the parent
    setIsOpen(false); // Close the dropdown
  };
  // const handleRateTypeChange = (type) => {
  //   setTempFilters((prev) => {
  //     const newFilters = { ...prev };
  //     if (type === "Fixed") {
  //       newFilters.Fixed = prev.Fixed === "No_Filter" ? "Ignore" : "No_Filter";
  //     } else if (type === "Variable") {
  //       newFilters.Variable = prev.Variable === "No_Filter" ? "Ignore" : "No_Filter";
  //     }
  //     return newFilters;
  //   });
  // };
  const handleClearFilters = () => {
    const clearedFilters = {
      propertyType: "",
      loanType: "",
      mortgageType: "",
      ownership: "",
      productPeriod: "Custom",
      customFrom: 60,
      customTo: 60,
      epcImprovements: false,
      // Fixed: "",
      // Variable: "",
      rateType: "Fixed",
    };

    setTempFilters(clearedFilters); // Reset temporary filters
    setSelectedOptions(clearedFilters); // Reset selected options in the parent
    handleOptionChange(clearedFilters); // Pass the cleared filters to the parent
  };
  return (
    <div className="filter-dropdown">
      <button className="filter-btn" onClick={toggleDropdown}>
        FILTER <span>&#9776;</span>
      </button>
      {isOpen && (

        <div className="filter-options">
          {(comparetText === "Compare Bridging Loans") && (
            <div>
              <h4>Property Type</h4>
              <label>
                <input
                  type="radio"
                  name="propertyType"
                  value="House"
                  checked={tempFilters.propertyType === "House"}
                  onChange={() => handleTempOptionChange("propertyType", "House")}
                />{" "}
                House
              </label>
              <label>
                <input
                  type="radio"
                  name="propertyType"
                  value="Flat"
                  checked={tempFilters.propertyType === "Flat"}
                  onChange={() => handleTempOptionChange("propertyType", "Flat")}
                />{" "}
                Flat
              </label>
              <label>
                <input
                  type="radio"
                  name="propertyType"
                  value="Maisonette"
                  checked={tempFilters.propertyType === "Maisonette"}
                  onChange={() => handleTempOptionChange("propertyType", "Maisonette")}
                />{" "}
                Maisonette
              </label>
              <label>
                <input
                  type="radio"
                  name="propertyType"
                  value="Bungalow"
                  checked={tempFilters.propertyType === "Bungalow"}
                  onChange={() => handleTempOptionChange("propertyType", "Bungalow")}
                />{" "}
                Bungalow
              </label>
            </div>
          )}

          {/* {(comparetText === "Buy-to-let Mortgage" ) && (
          <div>
            <h4>Loan Type</h4>
            <label>
              <input
                type="radio"
                name="loanType"
                value="Interest only"
                checked={tempFilters.loanType === "Interest only"}
                onChange={() => handleTempOptionChange("loanType", "Interest only")}
              />{" "}
              Interest only
            </label>
            <label>
              <input
                type="radio"
                name="loanType"
                value="Repayment"
                checked={tempFilters.loanType === "Repayment"}
                onChange={() => handleTempOptionChange("loanType", "Repayment")}
              />{" "}
              Repayment
            </label>
          </div>
          )} */}

          {/* <div>
            <h4>Mortgage Type</h4>
            <label>
              <input
                type="radio"
                name="mortgageType"
                value="Remortgage"
                checked={tempFilters.mortgageType === "Remortgage"}
                onChange={() => handleTempOptionChange("mortgageType", "Remortgage")}
              />{" "}
              Remortgage
            </label>
            <label>
              <input
                type="radio"
                name="mortgageType"
                value="Purchase"
                checked={tempFilters.mortgageType === "Purchase"}
                onChange={() => handleTempOptionChange("mortgageType", "Purchase")}
              />{" "}
              Purchase
            </label>
          </div> */}
          {(comparetText === "Buy-to-let Mortgage") && (
            <div>
              <h4>Ownership</h4>

              {/* Limited Company Section */}
              {/* <div style={{ display: "contents", alignItems: "center", marginBottom: "8px" }}>
   <span style={{ marginRight: "2px" ,color:"#000"}}>Limited Company</span>
   <label style={{ marginRight: "2px" }}>
     <input
       type="radio"
       name="LimitedCompany"
       value="Yes"
       checked={tempFilters.LimitedCompany === "Yes"}
       onChange={() => handleTempOptionChange("LimitedCompany", "Yes")}
     />
     Yes
   </label>
   <label>
     <input
       type="radio"
       name="LimitedCompany"
       value="No"
       checked={tempFilters.LimitedCompany === "No"}
       onChange={() => handleTempOptionChange("LimitedCompany", "No")}
     />
     No
   </label>
 </div> */}

              {/* Limited Company SPV Section */}
              <div style={{ display: "contents", alignItems: "center" }}>
                {/* <span style={{ marginRight: "2px" ,color:"#000"}}>Limited Company SPV</span> */}
                <label style={{ marginRight: "2px" }}>
                  <input
                    type="radio"
                    name="LimitedCompanySPV"
                    value="Yes"
                    checked={tempFilters.LimitedCompanySPV === "Yes"}
                    onChange={() => handleTempOptionChange("LimitedCompanySPV", "Yes")}
                  />
                  LimitedCompany
                </label>
                <label>
                  <input
                    type="radio"
                    name="LimitedCompanySPV"
                    value="No"
                    checked={tempFilters.LimitedCompanySPV === "No"}
                    onChange={() => handleTempOptionChange("LimitedCompanySPV", "No")}
                  />
                  Personal
                </label>
              </div>
            </div>

          )}
          {(comparetText === "Buy-to-let Mortgage" || comparetText === "Residential Mortgages") && (
     <div>
     <h4>Product Period</h4>
   
     {[
       { label: "All", value: "All" },
       { label: "2 Years", value: "2 years" },
       { label: "3 Years", value: "3 years" },
       { label: "5 Years", value: "5 years" },
       { label: "5+ Years", value: "5+ years" },
       
     ].map(({ label, value }) => (
       <label key={value} style={{ display: "block" }}>
         <input
           type="radio"
           name="productPeriod"
           value={value}
           checked={tempFilters.productPeriod === value}
           onChange={() => handleTempOptionChange("productPeriod", value)}
         />
         {label}
       </label>
     ))}
   
     {/* Custom Period */}
     <label style={{ display: "block" }}>
       <input
         type="radio"
         name="productPeriod"
         value="Custom"
         checked={tempFilters.productPeriod === "Custom"}
         onChange={() => handleTempOptionChange("productPeriod", "Custom")}
       />
       Custom
     </label>
   
     {/* Custom Input Fields (Fixed Size, No Layout Shift) */}
     <div
       style={{
        //  display: "flex",
         gap: "5px",
         alignItems: "center",
         visibility: tempFilters.productPeriod === "Custom" ? "visible" : "hidden",
        //  height: "30px", // Ensures space remains fixed
       }}
     >
       <label style={{ fontSize: "12px" }}>
         From (mths):
         <input
           type="number"
           value={tempFilters.customFrom || ""}
           onChange={(e) => {
             handleTempOptionChange("productPeriod", "Custom"); // Ensure productPeriod remains "Custom"
             handleTempOptionChange("customFrom", e.target.value);
           }}
           min="0"
           style={{
             width: "50px",
             height: "20px",
             marginLeft: "5px",
           }}
         />
       </label>
       <label style={{ fontSize: "12px" }}>
         To (mths):
         <input
           type="number"
           value={tempFilters.customTo || ""}
           onChange={(e) => {
             handleTempOptionChange("productPeriod", "Custom"); // Ensure productPeriod remains "Custom"
             handleTempOptionChange("customTo", e.target.value);
           }}
           min={tempFilters.customFrom || "0"}
           style={{
             width: "50px",
             height: "20px",
             marginLeft: "5px",
           }}
         />
       </label>
     </div>
   </div>
   
        
          )}

          <div>
            <h4>EPC Improvements</h4>
            <label>
              <input
                type="checkbox"
                name="epcImprovements"
                checked={tempFilters.epcImprovements}
                onChange={() => handleTempOptionChange("epcImprovements", !tempFilters.epcImprovements)}
              />{" "}
              EPC improvements
            </label>
          </div>
          <div>
            <h4>Rate Type</h4>
            <label>
              <input
                type="radio"
                name="rateType"
                value="Fixed"
                checked={tempFilters.rateType === "Fixed"}
                onChange={() => handleTempOptionChange("rateType", "Fixed")}
              />{" "}
              <span style={{ color: "black", paddingRight: "5px" }}>Fixed</span>
            </label>
            <label>
              <input
                type="radio"
                name="rateType"
                value="Variable"
                checked={tempFilters.rateType === "Variable"}
                onChange={() => handleTempOptionChange("rateType", "Variable")}
              />{" "}
              <span style={{ color: "black" }}>Variable</span>
            </label>
          </div>


          <button style={{ width: "fit-content", height: "fit-content" }} className="primary-btn results-btn" onClick={handleSave}>
            Save Filters
          </button>
          <button style={{ width: "fit-content", height: "fit-content", marginLeft: "5px" }} className="primary-btn results-btn" onClick={handleClearFilters}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;