# D1 Intent Parser - Frontend API Guide

## Quick Start
Convert natural language to SQL + get data visualizations. Supports English/Hindi.

**Base URL:** `https://your-app.onrender.com` or `http://localhost:3002`

## Main Endpoint
**POST** `/api/parse-query`

```javascript
// Request
{
  "query": "Show groundwater trend in Punjab"
}

// Response
{
  "query": "Show groundwater trend in Punjab",
  "language_detected": "en",
  "intent": "chart",
  "sql": "SELECT year, stage_extraction_pct FROM groundwater WHERE state='Punjab' ORDER BY year;",
  "data": [{"year": 2015, "value": 85.2}],
  "visualization_url": "http://31.220.72.148:3001/static/chart.png"
}
```

## Other Endpoints
- **GET** `/health` - Service status
- **POST** `/api/detect-language` - Detect language of text
- **POST** `/api/translate` - Translate to English

## Frontend Integration

### JavaScript
```javascript
async function parseQuery(query) {
  const response = await fetch('/api/parse-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return await response.json();
}

// Usage
const result = await parseQuery("Show groundwater trend in Punjab");
console.log(result.intent, result.data, result.visualization_url);
```

### React Hook
```jsx
export const useIntentParser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseQuery = async (query) => {
    setLoading(true);
    try {
      const response = await fetch('/api/parse-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const result = await response.json();
      if (result.error) setError(result.error);
      return result;
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return { parseQuery, loading, error };
};
```

## Intent Types
- `table` - Tabular data
- `chart` - Line/bar charts  
- `map` - Geographic maps
- `unknown` - Fallback

## Error Handling
```json
// Common errors
{"error": "Missing required field: query"}
{"error": "Invalid or unsafe SQL query"}
{"error": "D2 service unavailable or error"}
```

## Sample Queries
- "Show groundwater trend in Punjab"
- "हरियाणा के ओवर-एक्सप्लॉइटेड जिले दिखाएं" (Hindi)
- "List semi-critical blocks in Rajasthan"
- "Map of over-exploited blocks in Gujarat"