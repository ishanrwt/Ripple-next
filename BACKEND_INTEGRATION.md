# 🔌 Backend Integration Guide

## Node.js/Express Backend Integration

This guide helps you integrate your Next.js frontend with your Node.js/Express backend for the Ripple Effect groundwater data application.

## 🏗️ Backend Architecture Required

Your Node.js/Express backend should have the following services:

### **Developer 1 (D1): Core AI Engine**
- **Intent Parser Service**: Converts natural language to SQL
- **Multilingual Support**: Language detection and translation
- **API Endpoint**: `POST /api/parse-query`

### **Developer 2 (D2): Database & Visualization**
- **PostgreSQL Query Executor**: Executes SQL queries
- **Visualization Generator**: Creates charts and maps
- **Response Packaging**: Combines data and visualizations
- **API Endpoints**: 
  - `POST /api/execute-sql`
  - `POST /api/generate-visualization`

## 📡 Required API Endpoints

### 1. Intent Parser (D1)
```javascript
POST /api/parse-query
Content-Type: application/json

{
  "user_query": "Show me groundwater trends in Punjab",
  "language": "en"
}

Response:
{
  "sql": "SELECT * FROM groundwater_data WHERE state = 'Punjab' ORDER BY year",
  "language": "en",
  "explanation": "Here are the groundwater trends for Punjab over the years",
  "intent": "trend_analysis"
}
```

### 2. Database Executor (D2)
```javascript
POST /api/execute-sql
Content-Type: application/json

{
  "sql": "SELECT * FROM groundwater_data WHERE state = 'Punjab' ORDER BY year"
}

Response:
{
  "data": [
    { "year": 2020, "water_level": 15.2, "state": "Punjab" },
    { "year": 2021, "water_level": 14.8, "state": "Punjab" }
  ],
  "columns": ["year", "water_level", "state"],
  "rowCount": 2
}
```

### 3. Visualization Generator (D2)
```javascript
POST /api/generate-visualization
Content-Type: application/json

{
  "data": [
    { "year": 2020, "water_level": 15.2, "state": "Punjab" },
    { "year": 2021, "water_level": 14.8, "state": "Punjab" }
  ],
  "type": "chart"
}

Response:
{
  "type": "chart",
  "data": {
    "labels": ["2020", "2021"],
    "datasets": [{
      "label": "Water Level (m)",
      "data": [15.2, 14.8],
      "borderColor": "rgb(59, 130, 246)"
    }]
  }
}
```

## 🚀 Quick Start Integration

### 1. Update Environment
```bash
# Update .env.local
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

### 2. Start Your Backend
```bash
# In your backend directory
npm start
# or
node server.js
```

### 3. Start Frontend
```bash
# In your Next.js directory
npm run dev
```

## 🔧 Backend Implementation Examples

### Express.js Server Setup
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// D1: Intent Parser
app.post('/api/parse-query', async (req, res) => {
  const { user_query, language } = req.body;
  
  // Your AI/ML logic here
  const sql = generateSQL(user_query);
  const explanation = generateExplanation(user_query, sql);
  
  res.json({
    sql,
    language,
    explanation,
    intent: detectIntent(user_query)
  });
});

// D2: Database Executor
app.post('/api/execute-sql', async (req, res) => {
  const { sql } = req.body;
  
  // Your database logic here
  const result = await executeQuery(sql);
  
  res.json({
    data: result.rows,
    columns: result.columns,
    rowCount: result.rowCount
  });
});

// D2: Visualization Generator
app.post('/api/generate-visualization', async (req, res) => {
  const { data, type } = req.body;
  
  // Your visualization logic here
  const visualization = generateChart(data, type);
  
  res.json({
    type,
    data: visualization
  });
});

app.listen(8000, () => {
  console.log('Backend running on http://localhost:8000');
});
```

## 🧪 Testing Integration

### 1. Test Backend Endpoints
```bash
# Test intent parser
curl -X POST http://localhost:8000/api/parse-query \
  -H "Content-Type: application/json" \
  -d '{"user_query": "Show Punjab trends", "language": "en"}'

# Test SQL execution
curl -X POST http://localhost:8000/api/execute-sql \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM groundwater_data LIMIT 5"}'

# Test visualization
curl -X POST http://localhost:8000/api/generate-visualization \
  -H "Content-Type: application/json" \
  -d '{"data": [{"year": 2020, "level": 15.2}], "type": "chart"}'
```

### 2. Test Frontend Integration
1. Open `http://localhost:3000`
2. Try asking: "Show me groundwater trends in Punjab"
3. Check browser console for API calls
4. Verify data flows from backend to frontend

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```javascript
   // Add to your Express server
   app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true
   }));
   ```

2. **Connection Refused**
   - Check if backend is running on port 8000
   - Verify `NEXT_PUBLIC_BACKEND_API_URL` in `.env.local`

3. **API Response Format**
   - Ensure your backend returns the expected JSON structure
   - Check TypeScript interfaces in `lib/api/botService.ts`

4. **Database Connection**
   - Verify PostgreSQL connection in your backend
   - Check database credentials and connection string

### Debug Steps

1. **Check Network Tab**: Open browser DevTools → Network tab
2. **Check Console**: Look for error messages in browser console
3. **Test Backend Directly**: Use curl or Postman to test endpoints
4. **Check Logs**: Monitor backend server logs for errors

## 📊 Data Flow

```
User Query → Frontend → D1 (Intent Parser) → D2 (SQL Executor) → D2 (Visualization) → Frontend → User
```

1. User types query in chat
2. Frontend sends to `/api/parse-query`
3. D1 returns SQL and explanation
4. Frontend sends SQL to `/api/execute-sql`
5. D2 returns data from database
6. Frontend sends data to `/api/generate-visualization`
7. D2 returns chart/map configuration
8. Frontend displays visualization to user

## 🎯 Next Steps

1. **Implement Backend**: Create the required API endpoints
2. **Test Integration**: Use the provided test commands
3. **Deploy**: Deploy both frontend and backend
4. **Monitor**: Set up logging and monitoring
5. **Scale**: Optimize for production use

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL with Node.js](https://node-postgres.com/)
- [Chart.js for Visualizations](https://www.chartjs.org/)
- [CORS Configuration](https://expressjs.com/en/resources/middleware/cors.html)
