const axios = require("axios");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      throw new Error("GOOGLE_SCRIPT_URL is not defined in environment variables");
    }

    // Determine type based on request or allow data to specify it
    // The server.js logic used specific endpoints, so we'll match that
    const path = event.path.split("/").pop();
    
    let type = data.type;
    if (path === "subscribe") type = "newsletter";
    else if (path === "submit-fixed-rate-reminder") type = "FixedRateReminder";
    else if (path === "submit-loan-application") type = "LoanApplication";
    else if (path === "first-time-buyers") type = "FirstTimeBuyer";
    else if (path === "commercial-mortgages") type = "commercialMortgages";

    const response = await axios.post(GOOGLE_SCRIPT_URL, { ...data, type });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "✅ Success!", data: response.data }),
    };
  } catch (error) {
    console.error("❌ Submission Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "❌ Failed to submit data.", details: error.message }),
    };
  }
};
