const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const API_URL = process.env.TWENTY7TEC_API_URL;
const LICENSE_KEY = process.env.TWENTY7TEC_LICENSE_KEY;
const COMPANY_ID = process.env.TWENTY7TEC_COMPANY_ID;
const SITE_ID = process.env.TWENTY7TEC_SITE_ID;
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

const generateSoapRequestBody = (mortgageType, params) => {
  let productTermPeriodFromMonths = "";
  let productTermPeriodToMonths = "";
  let GreenEcoProduct = "";
  let bridingPaymentMethod = "";
  let buyToLetPaymentMethod = ""
  let MortgageClass = "";
  let LimitedCompany = "";

  if (mortgageType === "Standard" || mortgageType === "Buy_To_Let") {
    const rateTypeMapping = {
      Fixed: `
        <tem:MortgageClass>
          <tem:Fixed>No_Filter</tem:Fixed>
          <tem:Variable>Ignore</tem:Variable>
          <tem:Capped>Ignore</tem:Capped>
          <tem:LiborLinked>Ignore</tem:LiborLinked>
          <tem:Discount>Ignore</tem:Discount>
          <tem:Tracker>Ignore</tem:Tracker>
        </tem:MortgageClass>`,
      Variable: `
        <tem:MortgageClass>
          <tem:Fixed>Ignore</tem:Fixed>
          <tem:Variable>No_Filter</tem:Variable>
          <tem:Capped>Ignore</tem:Capped>
          <tem:LiborLinked>Ignore</tem:LiborLinked>
          <tem:Discount>Ignore</tem:Discount>
          <tem:Tracker>Ignore</tem:Tracker>
        </tem:MortgageClass>`
    };
    
    MortgageClass = rateTypeMapping[params.rateType] || "";

    if (params.LimitedCompany || params.LimitedCompanySPV) {
      LimitedCompany = `<tem:BuyToLetDetails>
                          ${params.LimitedCompany ? `<tem:LimitedCompany>${params.LimitedCompany}</tem:LimitedCompany>` : ""}
                          ${params.LimitedCompanySPV ? `<tem:LimitedCompanySPV>${params.LimitedCompanySPV}</tem:LimitedCompanySPV>` : ""}
                        </tem:BuyToLetDetails>`.trim();
    }

    if (params.paymentMethod) {
      bridingPaymentMethod = `<tem:SecuredLoanDetails>
         <tem:BridgingDetails>
          <tem:BridgingPaymentMethod>${params.paymentMethod}</tem:BridgingPaymentMethod>
          </tem:BridgingDetails>
          </tem:SecuredLoanDetails>`
    }
    if (params.buyToLetPaymentMethod) {
      buyToLetPaymentMethod = `<tem:PaymentMethod>${params.buyToLetPaymentMethod}</tem:PaymentMethod>`;
    }
    
    switch (params.epcImprovements) {
      case true:
        GreenEcoProduct = "<tem:GreenEcoProduct>Include</tem:GreenEcoProduct>";
        break;
      default:
        GreenEcoProduct = "";
    }

    switch (params.productPeriod) {
      case "5+ years":
        productTermPeriodFromMonths = "<tem:ProductTermPeriodFromMonths>60</tem:ProductTermPeriodFromMonths>";
        productTermPeriodToMonths = "<tem:ProductTermPeriodToMonths>75</tem:ProductTermPeriodToMonths>";
        break;
      case "2 years":
        productTermPeriodFromMonths = "<tem:ProductTermPeriodFromMonths>24</tem:ProductTermPeriodFromMonths>";
        productTermPeriodToMonths = "<tem:ProductTermPeriodToMonths>24</tem:ProductTermPeriodToMonths>";
        break;
      case "3 years":
        productTermPeriodFromMonths = "<tem:ProductTermPeriodFromMonths>36</tem:ProductTermPeriodFromMonths>";
        productTermPeriodToMonths = "<tem:ProductTermPeriodToMonths>36</tem:ProductTermPeriodToMonths>";
        break;
      case "4 years":
        productTermPeriodFromMonths = "<tem:ProductTermPeriodFromMonths>48</tem:ProductTermPeriodFromMonths>";
        productTermPeriodToMonths = "<tem:ProductTermPeriodToMonths>75</tem:ProductTermPeriodToMonths>";
        break;
      case "5 years":
        productTermPeriodFromMonths = "<tem:ProductTermPeriodFromMonths>60</tem:ProductTermPeriodFromMonths>";
        productTermPeriodToMonths = "<tem:ProductTermPeriodToMonths>60</tem:ProductTermPeriodToMonths>";
        break;
      case "Custom":
        productTermPeriodFromMonths = `<tem:ProductTermPeriodFromMonths>${params.customFrom}</tem:ProductTermPeriodFromMonths>`;
        productTermPeriodToMonths = `<tem:ProductTermPeriodToMonths>${params.customTo}</tem:ProductTermPeriodToMonths>`;
        break;  
      default:
        productTermPeriodFromMonths = "";
        productTermPeriodToMonths = "";
    }
  }

  return `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
     <soapenv:Header/>
     <soapenv:Body>
        <tem:RunSource>
           <tem:licenseKey>${LICENSE_KEY}</tem:licenseKey>
           <tem:input>
              <tem:CompanyId>${COMPANY_ID}</tem:CompanyId>
              <tem:SiteId>${SITE_ID}</tem:SiteId>
              <tem:ExpectedValuation>${params.propertyValue || params.expectedValuation || 0}</tem:ExpectedValuation>
              <tem:LoanRequired>${params.loanRequired || 0}</tem:LoanRequired>
              <tem:ReasonForMortgage>${params.loanType || "Purchase"}</tem:ReasonForMortgage>
              <tem:MortgageType>${mortgageType}</tem:MortgageType>
              <tem:Term>${params.termMonths || 0}</tem:Term>
              <tem:TermUnit>${params.termUnit || "Years"}</tem:TermUnit>
              ${MortgageClass}
               <tem:Filters>
                ${productTermPeriodFromMonths}
                ${productTermPeriodToMonths}
                ${GreenEcoProduct}
                <tem:BestFiveEachLender>true</tem:BestFiveEachLender>
            </tem:Filters>
            ${bridingPaymentMethod}
            ${buyToLetPaymentMethod}
            ${LimitedCompany}
           </tem:input>
        </tem:RunSource>
     </soapenv:Body>
  </soapenv:Envelope>`.trim();
};

app.post("/api/mortgage", async (req, res) => {
  try {
    const { mortgageType, params } = req.body;
    const requestBody = generateSoapRequestBody(mortgageType, params);

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "http://tempuri.org/ISourcing/RunSource"
      }
    });

    const fullData = await parseXmlResponse(response.data);
    const results = fullData?.["s:Envelope"]?.["s:Body"]?.RunSourceResponse?.RunSourceResult?.Results?.Results;
    
    res.json({ Results: { Results: results } });
  } catch (error) {
    console.error("❌ Mortgage API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch mortgage data" });
  }
});

// Other endpoints (Fixed Rate, Newsletter, etc.) stay the same
app.post("/submit-fixed-rate-reminder", async (req, res) => {
  try {
    await axios.post(GOOGLE_SCRIPT_URL, { type: "FixedRateReminder", ...req.body });
    res.json({ message: "✅ Success!" });
  } catch (error) { res.status(500).json({ error: "❌ Failed." }); }
});

app.post("/subscribe", async (req, res) => {
  try {
    await axios.post(GOOGLE_SCRIPT_URL, { type: "newsletter", email: req.body.email });
    res.json({ message: "✅ Subscribed!" });
  } catch (error) { res.status(500).json({ error: "❌ Failed." }); }
});

app.post("/submit-loan-application", async (req, res) => {
    try {
      await axios.post(GOOGLE_SCRIPT_URL, { type: "LoanApplication", ...req.body });
      res.json({ message: "✅ Success!" });
    } catch (error) { res.status(500).json({ error: "❌ Failed." }); }
  });

const parseXmlResponse = (xmlData) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Serving the React Build
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});