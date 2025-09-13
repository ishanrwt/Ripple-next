// Bot service for handling AI responses with frontend-friendly visualization data

export const getBotResponse = async (message: string) => {
  const D1_URL = process.env.NEXT_PUBLIC_D1_API_URL || "https://ai-engine-1.onrender.com";
  const D2_URL = process.env.NEXT_PUBLIC_D2_API_URL || "http://31.220.72.148:3001";

  console.log("D1 URL:", D1_URL);
  console.log("D2 URL:", D2_URL);

  try {
    // Step 1: D1 for intent + SQL
    const d1Response = await parseQuery(message);
    console.log("D1 Response:", d1Response);

    // Step 2: D2 for SQL data
    const d2DataResponse = await executeSQL(d1Response.sql);
    console.log("D2 Data Response:", d2DataResponse);

    // Step 3: Prepare visualization data for charts/maps
    let d2VizResponse = null;
    if (d1Response.intent === "chart" || d1Response.intent === "map" || d1Response.intent === "bar" || d1Response.intent === "pie") {
      d2VizResponse = formatVizData(d2DataResponse.data, d1Response.intent);
      console.log("Formatted Viz Data:", d2VizResponse);
    }

    // Step 4: Final response for UI
    return {
      id: Date.now(),
      sender: "bot",
      text: `Here's the ${d1Response.intent} for your query: "${d1Response.query}"`,
      type:
        d1Response.intent === "chart"
          ? "chart"
          : d1Response.intent === "map"
          ? "map"
          : d1Response.intent === "bar"
          ? "bar"
          : d1Response.intent === "pie"
          ? "pie"
          : d1Response.intent === "table"
          ? "table"
          : "text",
      data: d2VizResponse,
      rawData: d2DataResponse.data,
    };
  } catch (error) {
    console.error("Error in bot response:", error);
    return getMockResponse(message);
  }
};

// ---------------- Helper: Visualization Formatter ----------------
const formatVizData = (data: any[], intent: string) => {
  if (!data || data.length === 0) return null;

  if (intent === "chart" || intent.includes("trend")) {
    return {
      labels: data.map((d) => d.year || d.label || ""),
      datasets: [
        {
          label: "GW Recharge (ham)",
          data: data.map((d) => parseFloat(d.gw_recharge_rainfall_ham || 0)),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.1,
        },
        {
          label: "GW Extraction (ham)",
          data: data.map((d) => parseFloat(d.gw_extraction_total_ham || 0)),
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.1,
        },
      ],
    };
  }

  if (intent === "bar" || intent.includes("comparison")) {
    return {
      labels: data.map((d) => d.year || d.category || ""),
      datasets: [
        {
          label: "GW Extraction",
          data: data.map((d) => parseFloat(d.gw_extraction_total_ham || 0)),
          backgroundColor: "rgba(59, 130, 246, 0.7)",
        },
      ],
    };
  }

  if (intent === "pie" || intent.includes("distribution")) {
    return {
      labels: data.map((d) => d.category || d.year || ""),
      datasets: [
        {
          data: data.map((d) => parseFloat(d.gw_extraction_total_ham || 0)),
          backgroundColor: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#6366F1"],
        },
      ],
    };
  }

  if (intent === "map" || intent.includes("heatmap")) {
    return data.map((d) => ({
      lat: parseFloat(d.lat || d.x || 0),
      lng: parseFloat(d.lng || d.y || 0),
      value: parseFloat(d.value || d.gw_extraction_total_ham || 0),
    }));
  }

  return null;
};

// ---------------- Intent → Visualization Type ----------------
const mapIntentToVizType = (intent: string) => {
  if (intent === "map" || intent.includes("heatmap") || intent.includes("location")) return "heatmap";
  if (intent === "chart" || intent.includes("trend") || intent.includes("graph")) return "timeline";
  if (intent.includes("bar") || intent.includes("comparison")) return "bar_chart";
  if (intent.includes("pie") || intent.includes("distribution")) return "pie_chart";
  return "timeline";
};

// ---------------- D1 API ----------------
export const parseQuery = async (query: string) => {
  const D1_URL = process.env.NEXT_PUBLIC_D1_API_URL || "https://ai-engine-1.onrender.com";
  const response = await fetch(`${D1_URL}/api/parse-query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error(`D1 parse failed: ${response.statusText}`);
  return await response.json();
};

// ---------------- D2 SQL API ----------------
export const executeSQL = async (sql: string) => {
  const D2_URL = process.env.NEXT_PUBLIC_D2_API_URL || "http://31.220.72.148:3001";
  const response = await fetch(`${D2_URL}/api/execute-sql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql }),
  });
  if (!response.ok) throw new Error(`D2 SQL failed: ${response.statusText}`);
  return await response.json();
};

// ---------------- D2 Visualization API ----------------
export const generateVisualization = async (data: any[], intent: string) => {
  const D2_URL = process.env.NEXT_PUBLIC_D2_API_URL || "http://31.220.72.148:3001";
  const vizType = mapIntentToVizType(intent);
  const response = await fetch(`${D2_URL}/api/generate-visualization`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: vizType, data }),
  });
  if (!response.ok) throw new Error(`D2 Viz failed: ${response.statusText}`);
  return await response.json();
};

// ---------------- Mock Fallback ----------------
const getMockResponse = (message: string) => {
  const lower = message.toLowerCase();
  if (lower.includes("map")) {
    return { id: Date.now(), sender: "bot", text: "Mock Heatmap", type: "map", data: [{ lat: 31.1, lng: 75.3, value: 100 }] };
  }
  if (lower.includes("chart")) {
    return { id: Date.now(), sender: "bot", text: "Mock Chart", type: "chart", data: formatVizData([{ year: "2023", gw_recharge_rainfall_ham: 100, gw_extraction_total_ham: 50 }], "chart") };
  }
  if (lower.includes("table")) {
    return { id: Date.now(), sender: "bot", text: "Mock Table", type: "table", rawData: [{ year: "2023", rainfall: 1000 }] };
  }
  return { id: Date.now(), sender: "bot", text: "Mock Text", type: "text" };
};
