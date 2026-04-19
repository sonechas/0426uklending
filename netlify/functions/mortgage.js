const axios = require("axios");
const xml2js = require("xml2js");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { mortgageType, params } = JSON.parse(event.body);
    
    // Environment variables from Netlify
    const API_URL = process.env.TWENTY7TEC_API_URL;
    const LICENSE_KEY = process.env.TWENTY7TEC_LICENSE_KEY;
    const COMPANY_ID = process.env.TWENTY7TEC_COMPANY_ID;
    const SITE_ID = process.env.TWENTY7TEC_SITE_ID;

    const requestBody = generateSoapRequestBody(mortgageType, params, {
        LICENSE_KEY,
        COMPANY_ID,
        SITE_ID
    });

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "http://tempuri.org/ISourcing/RunSource"
      }
    });

    const parsedData = await parseXmlResponse(response.data);
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow CORS
      },
      body: JSON.stringify(parsedData),
    };
  } catch (error) {
    console.error("❌ Mortgage API Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch mortgage data", details: error.message }),
    };
  }
};

const generateSoapRequestBody = (mortgageType, params, keys) => {
  const { LICENSE_KEY, COMPANY_ID, SITE_ID } = keys;
  let productTermPeriodFromMonths = "";
  let productTermPeriodToMonths = "";
  let GreenEcoProduct = "";
  let brigingPaymentMethod = "";
  let buyToLetPaymentMethod = ""
  let MortgageClass = "";
  let LimitedCompanySPV = "";
  let LimitedCompany = "";

  if(mortgageType === "Standard" || mortgageType === "Buy_To_Let"){
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
      brigingPaymentMethod = `<tem:SecuredLoanDetails>
         <tem:BridgingDetails>
          <tem:BridgingPaymentMethod>${params.paymentMethod}</tem:BridgingPaymentMethod>
          </tem:BridgingDetails>
          </tem:SecuredLoanDetails>`
    }
    if (params.buyToLetPaymentMethod) {
      buyToLetPaymentMethod = `
        <tem:PaymentMethod>${params.buyToLetPaymentMethod}</tem:PaymentMethod>
       `
    }
    switch (params.epcImprovements) {
      case true:
        GreenEcoProduct = "<tem:GreenEcoProduct>Include</tem:GreenEcoProduct>";
        break;
      default:
        GreenEcoProduct = '';
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
              <tem:ExpectedValuation>${params.expectedValuation || 0}</tem:ExpectedValuation>
              <tem:LoanRequired>${params.loanRequired || 0}</tem:LoanRequired>
              <tem:ReasonForMortgage>${params.loanTypex || "Purchase"}</tem:ReasonForMortgage>
              <tem:MortgageType>${mortgageType}</tem:MortgageType>
              <tem:Term>${params.termMonths || 0}</tem:Term>
              <tem:TermUnit>${params.termUnit || "Years"}</tem:TermUnit>
              ${MortgageClass}
               <tem:Filters>
                ${productTermPeriodFromMonths}
                ${productTermPeriodToMonths}
                ${GreenEcoProduct}
            </tem:Filters>
            ${brigingPaymentMethod}
            ${buyToLetPaymentMethod}
            ${LimitedCompany}
            ${LimitedCompanySPV}
           </tem:input>
        </tem:RunSource>
     </soapenv:Body>
  </soapenv:Envelope>`;
};

const parseXmlResponse = (xmlData) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
