import React, { useState } from "react";
import { FaCaretRight } from "react-icons/fa";
import '../css/LoanComparisonForm.css';

const LoanComparisonForm = ({
  onGetResults,
  comparetText,
  loanRequired,
  setLoanRequired,
  propertyValue,
  setPropertyValue,
  termMonths,
  setTermMonths,
  termUnit,
  loanType,
  setLoanType,
  paymentMethod,
  setPaymentMethod,
}) => {
  const [ltvError, setLtvError] = useState("");

  const formatNumber = (value) => {
    return value ? Number(value).toLocaleString() : "";
  };

  const handleInputChange = (value, setter) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setter(numericValue);
    setLtvError(""); // clear error as user adjusts values
  };

  const calculateDeposit = () => {
    const loan = Number(loanRequired);
    const value = Number(propertyValue);
    const deposit = value - loan;
    return deposit > 0 ? deposit : 0;
  };

  const calculateLTV = () => {
    const loan = Number(loanRequired);
    const value = Number(propertyValue);
    if (!loan || !value || value === 0) return null;
    return (loan / value) * 100;
  };

  const getLTVColor = (ltv) => {
    if (ltv <= 75) return "green";
    if (ltv <= 85) return "orange";
    return "red";
  };

  const getMaxLTVByService = () => {
    switch (comparetText) {
      case "Residential Mortgages":
        return 95;
      case "Compare Bridging Loans":
        return 100;
      case "Buy-to-let Mortgage":
        return 85;
      case "First-Time Buyer Mortgages":
      case "First Time Buyer Mortgages":
        return 100;
      default:
        return 100;
    }
  };

  const handleGetResults = () => {
    const ltv = calculateLTV();
    const maxLTV = getMaxLTVByService();
    if (ltv && ltv > maxLTV) {
      setLtvError(`Please reduce the loan amount to meet the maximum LTV requirement of ${maxLTV}%.`);
      return;
    }

    setLtvError("");
    onGetResults();
  };

  const showDepositField = [
    "Buy-to-let Mortgage",
    "Residential Mortgages",
    "First-Time Buyer Mortgages",
    "First Time Buyer Mortgages"
  ].includes(comparetText);

  const ltv = calculateLTV();

  return (
    <section className="steps-row" id="steps-row">
      <div className="container">
        <div className="loan-col-left">
          <h2 className="secondary-heading">{comparetText}</h2>
          <div className="input-fields">
            {showDepositField && (
              <label>
                LOAN PURPOSE
                <div className="input-wrapper" style={{ marginTop: "10px" }}>
                  <input
                    type="radio"
                    id="purchase"
                    name="loanType"
                    value="Purchase"
                    checked={loanType === "Purchase"}
                    onChange={(e) => setLoanType(e.target.value)}
                  />
                  <label htmlFor="purchase" style={{ paddingLeft: "5px", paddingRight: "25px" }}>Purchase</label>
                  <input
                    type="radio"
                    id="remortgage"
                    name="loanType"
                    value="Remortgage"
                    checked={loanType === "Remortgage"}
                    onChange={(e) => setLoanType(e.target.value)}
                  />
                  <label htmlFor="remortgage" style={{ paddingLeft: "5px", paddingRight: "5px" }}>Remortgage</label>
                </div>
              </label>
            )}

            {/* Loan Required + Deposit side by side */}
            <div className="dual-field-row">
              <label style={{ flex: 1, marginRight: "16px" }}>
                LOAN REQUIRED
                <div className="input-wrapper">
                  <span className="input-prefix">£</span>
                  <input
                    type="text"
                    value={formatNumber(loanRequired)}
                    onChange={(e) => handleInputChange(e.target.value, setLoanRequired)}
                    list="loan-required-suggestions"
                    placeholder="Enter loan amount"
                  />
                </div>
              </label>

              {showDepositField && (
                <label style={{ flex: 1 }}>
                  DEPOSIT AMOUNT
                  <div className="input-wrapper">
                    <span className="input-prefix">£</span>
                    <input
                      type="text"
                      value={formatNumber(calculateDeposit())}
                      readOnly
                      style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                    />
                  </div>
                  {ltv && (
                    <small
                      style={{
                        marginTop: "5px",
                        display: "block",
                        color: getLTVColor(ltv),
                        fontWeight: "bold"
                      }}
                    >
                      Loan to Value (LTV): {ltv.toFixed(2)}%
                    </small>
                  )}
                </label>
              )}
            </div>

            <label>
              PROPERTY VALUE
              <div className="input-wrapper">
                <span className="input-prefix">£</span>
                <input
                  type="text"
                  value={formatNumber(propertyValue)}
                  onChange={(e) => handleInputChange(e.target.value, setPropertyValue)}
                  list="property-value-suggestions"
                  placeholder="Enter property value"
                />
              </div>
            </label>

            <label>
              TERM ({termUnit})
              <div className="input-wrapper">
                <span className="input-prefix" style={{ color: "white" }}>£</span>
                <input
                  type="text"
                  value={formatNumber(termMonths)}
                  onChange={(e) => handleInputChange(e.target.value, setTermMonths)}
                  list="term-months-suggestions"
                  placeholder="Enter term"
                />
              </div>
            </label>

            {comparetText === "Compare Bridging Loans" && (
              <label>
                Calculation Method
                <div className="input-wrapper" style={{ marginTop: "10px" }}>
                  <input
                    type="radio"
                    id="rolled-up"
                    name="paymentMethod"
                    value="RolledUp"
                    checked={paymentMethod === "RolledUp"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="rolled-up" style={{ paddingLeft: "5px", paddingRight: "25px" }}>Rolled Up</label>
                  <input
                    type="radio"
                    id="retained"
                    name="paymentMethod"
                    value="Retained"
                    checked={paymentMethod === "Retained"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="retained" style={{ paddingLeft: "5px", paddingRight: "25px" }}>Retained</label>
                </div>
              </label>
            )}

            {comparetText === "Buy-to-let Mortgage" && (
              <label>
                Loan Type
                <div className="input-wrapper" style={{ marginTop: "10px" }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="interest-only"
                    value="Interest_Only"
                    checked={paymentMethod === "Interest_Only"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="interest-only" style={{ paddingLeft: "5px", paddingRight: "25px" }}>Interest only</label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="repayment"
                    value="Repayment"
                    checked={paymentMethod === "Repayment"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="repayment" style={{ paddingLeft: "5px", paddingRight: "25px" }}>Repayment</label>
                </div>
              </label>
            )}
          </div>
          {comparetText === "Buy-to-let Mortgage" && (
          <div style={{ margin: "25px 0 15px 0", textAlign: "center" }}>
            <p style={{ fontSize: "1em", margin: 0 }}>
              Own more than 3 buy-to-let properties or want to transfer a portfolio?{" "}
              <a
                href="/configure?contactMethod=Phone&service=Buy%20to%20Let&ownMultipleProperties=Yes"
                style={{ color: "#005ec4", textDecoration: "underline" }}
              >
                Click here
              </a>
            </p>
          </div>
        )}


          <button onClick={handleGetResults} className="primary-btn results-btn">
            GET RESULTS <FaCaretRight />
          </button>

          {ltvError && (
            <div style={{ color: "red", marginTop: "10px", fontWeight: "bold" }}>
              {ltvError}
            </div>
          )}
        </div>

        <div className="steps">
          <div className="step">
            <h4>🔍 Compare Deals</h4>
            <p className="default-text">Instantly access rates from 100+ lenders.</p>
          </div>
          <div className="step">
            <h4>📞 Get Personalised Support</h4>
            <p className="default-text">We handle the paperwork — fast and stress-free.</p>
          </div>
          <div className="step">
            <h4>📝 Apply with Confidence</h4>
            <p className="default-text">Complete your deal with the help of our property experts.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanComparisonForm;