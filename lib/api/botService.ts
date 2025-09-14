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

    // Step 2: Get data (either from D1 directly or via D2 SQL)
    let d2DataResponse;
    if (d1Response.data && !d1Response.sql) {
      console.log("Using data directly from D1 response");
      d2DataResponse = { data: d1Response.data };
    } else {
      d2DataResponse = await executeSQL(d1Response.sql);
    }
    console.log("D2 Data Response:", d2DataResponse);

    // Step 3: Prepare visualization data
    let d2VizResponse = null;
    
    // Format the visualization data
    if (d1Response.data && d1Response.data.length > 0) {
      // Check for specific visualization requests
      const wantsPieChart = message.toLowerCase().includes('pie') || 
                           d1Response.visualization?.type === 'pie' ||
                           d1Response.intent === 'pie';
                           
      // Determine visualization type
      const vizType = wantsPieChart ? 'pie' : 
                     d1Response.visualization?.type ||
                     (d1Response.data[0].hasOwnProperty('district') ? 'bar' : 'chart');
      
      d2VizResponse = formatVizData(d2DataResponse.data, vizType);
      
      // Add any additional options from D1 response
      if (d1Response.visualization?.options) {
        d2VizResponse = {
          ...d2VizResponse,
          options: {
            ...(d2VizResponse.options || {}),
            ...d1Response.visualization.options
          }
        };
      }
    }
    console.log("Visualization Response:", d2VizResponse);

    // Step 4: Final response for UI
    // Extract visualization type from D1 response
    const vizType = d1Response.visualization?.type || d1Response.intent || "text";
    const userQuery = d1Response.text || message;  // Use text from D1 or original message
    
    return {
      id: Date.now(),
      sender: "bot",
      text: `Here's the ${vizType} visualization for: "${userQuery}"`,
      type: vizType === "timeline" ? "chart" : vizType,  // Map timeline to chart type
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
  if (!data || data.length === 0) {
    return { error: true, message: "cannot process it right now please input another query" };
  }

  // Detect key fields
  const keys = Object.keys(data[0]);
  const hasYear = keys.includes("year");
  const hasDistrict = keys.includes("district");

  // Pick X-axis intelligently
  const xField = hasYear ? "year" : hasDistrict ? "district" : keys[0];
  const yFields = keys.filter((k) => k !== xField);

  // If no numeric fields → cannot chart
  if (yFields.length === 0) {
    return { error: true, message: "cannot process it right now please input another query" };
  }

  switch (intent) {
    case "chart":
    case "timeline":
      // For district-wise data, prefer a bar chart
      if (hasDistrict) {
        return {
          type: "bar",
          labels: data.map((row) => row.district),
          datasets: [
            {
              label: "Rainfall (mm)",
              data: data.map((row) => parseFloat(row.rainfall_mm)),
              backgroundColor: `hsla(200, 70%, 50%, 0.6)`,
            },
            {
              label: "Groundwater Recharge (HAM)",
              data: data.map((row) => parseFloat(row.gw_recharge_rainfall_ham)),
              backgroundColor: `hsla(120, 70%, 50%, 0.6)`,
            }
          ],
        };
      }
      // For time series, use line chart
      return {
        type: "line",
        labels: data.map((row) => row[xField]),
        datasets: yFields.map((field, idx) => ({
          label: field.replace(/_/g, " "),
          data: data.map((row) => parseFloat(row[field])),
          borderColor: `hsl(${idx * 60}, 70%, 50%)`,
          backgroundColor: `hsla(${idx * 60}, 70%, 50%, 0.3)`,
          fill: false,
          tension: 0.3,
        })),
      };

    case "bar":
      return {
        type: "bar",
        labels: data.map((row) => row[xField]),
        datasets: yFields.map((field, idx) => ({
          label: field.replace(/_/g, " "),
          data: data.map((row) => parseFloat(row[field])),
          backgroundColor: `hsl(${idx * 60}, 70%, 50%)`,
        })),
      };

    case "pie":
      // For pie charts, ensure we're using the district as labels
      return {
        type: "pie",
        labels: data.map((row) => row.district || row[xField]),
        datasets: [
          {
            label: "Rainfall Distribution",
            data: data.map((row) => parseFloat(row.rainfall_mm || row[yFields[0]])),
            backgroundColor: data.map((_, idx) => `hsla(${idx * 12}, 70%, 50%, 0.8)`),
            borderColor: data.map((_, idx) => `hsl(${idx * 12}, 70%, 45%)`),
            borderWidth: 1
          },
        ],
        options: {
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 20
              }
            }
          }
        }
      };

    default:
      // Auto decide: if district → bar, else line
      if (hasDistrict) {
        return {
          type: "bar",
          labels: data.map((row) => row[xField]),
          datasets: yFields.map((field, idx) => ({
            label: field.replace(/_/g, " "),
            data: data.map((row) => parseFloat(row[field])),
            backgroundColor: `hsl(${idx * 60}, 70%, 50%)`,
          })),
        };
      } else if (hasYear) {
        return {
          type: "line",
          labels: data.map((row) => row[xField]),
          datasets: yFields.map((field, idx) => ({
            label: field.replace(/_/g, " "),
            data: data.map((row) => parseFloat(row[field])),
            borderColor: `hsl(${idx * 60}, 70%, 50%)`,
            backgroundColor: `hsla(${idx * 60}, 70%, 50%, 0.3)`,
            fill: false,
          })),
        };
      }

      return { error: true, message: "cannot process it right now please input another query" };
  }
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
  try {
    const response = await fetch(`${D1_URL}/api/parse-query`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        query,
        type: "query", // Specify the type of request
        options: {
          visualization: true, // Request visualization support
          format: "json"
        }
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("D1 API Error Response:", errorText);
      throw new Error(`D1 parse failed: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log("D1 API Response:", data);
    return data;
  } catch (error) {
    console.error("D1 API Error:", error);
    throw error;
  }
};

// ---------------- D2 SQL API (FIXED → sends { sql }) ----------------
export const executeSQL = async (sql: string) => {
  const D2_URL = process.env.NEXT_PUBLIC_D2_API_URL || "http://31.220.72.148:3001";
  console.log("Original SQL query:", sql);

  // Fix year format in SQL if needed
  let modifiedSql = sql;
  if (sql.includes('year')) {
    modifiedSql = sql.replace(/year\s*=\s*'?\d{4}'?/g, (match: string) => {
      const yearMatch = match.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : '2023';
      return `year LIKE '${year}%'`;
    });
  }
  
  console.log("Modified SQL query:", modifiedSql);
  
  try {
    const response = await fetch(`${D2_URL}/api/execute-sql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: modifiedSql }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("D2 SQL Error Response:", errorText);
      throw new Error(`D2 SQL failed: ${response.statusText} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("D2 SQL Error:", error);
    throw error;
  }
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
    return {
      id: Date.now(),
      sender: "bot",
      text: "Mock Chart",
      type: "chart",
      data: formatVizData(
        [{ year: "2023", gw_recharge_rainfall_ham: 100, gw_extraction_total_ham: 50 }],
        "chart"
      ),
    };
  }
  if (lower.includes("table")) {
    return { id: Date.now(), sender: "bot", text: "Mock Table", type: "table", rawData: [{ year: "2023", rainfall: 1000 }] };
  }
  return { id: Date.now(), sender: "bot", text: "Mock Text", type: "text" };
};
