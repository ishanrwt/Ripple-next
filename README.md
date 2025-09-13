# Ripple Effect - Next.js Frontend

AI-powered conversational interface for Indian groundwater data analysis and insights.

## 🚀 Migration from React to Next.js

This project has been migrated from Create React App to Next.js 14 with TypeScript for better performance, SEO, and backend integration capabilities.

## 📁 Project Structure

```
ripple-next/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Message.tsx        # Chat message component
│   ├── SuggestedQuery.tsx # Query suggestions
│   ├── ChartComponent.tsx # Data visualization
│   ├── MapComponent.tsx   # Map wrapper
│   ├── MapLeaflet.tsx     # Leaflet map implementation
│   └── VisualDataModal.tsx # Data modal
├── lib/                   # Utility libraries
│   └── api/              # API services
│       ├── botService.ts  # AI bot integration
│       └── dataApi.ts     # Data fetching
├── public/               # Static assets
└── ...config files
```

## 🛠️ Backend Integration

The frontend is designed to integrate seamlessly with your FastAPI backend:

### API Endpoints Expected:
- `POST /api/parse-query` - Intent parsing and SQL generation
- `POST /api/execute-sql` - Database query execution
- `POST /api/generate-visualization` - Chart/map generation
- `GET /api/districts` - District data retrieval
- `GET /api/trends` - Historical trend data
- `GET /api/heatmap` - Heatmap data

### Environment Configuration:
```bash
# Copy env.example to .env.local
cp env.example .env.local

# Update the backend URL
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your backend URL
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Key Features

- **TypeScript Support** - Full type safety
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Toggle between light/dark themes
- **Real-time Chat** - Conversational AI interface
- **Data Visualization** - Charts and maps
- **Multilingual Support** - Ready for i18n
- **API Integration** - Seamless backend connectivity

## 🎨 UI/UX Improvements

- Modern Next.js 14 App Router
- Improved performance with SSR/SSG
- Better SEO optimization
- Enhanced accessibility
- Responsive design improvements
- TypeScript for better development experience

## 🔌 Backend Integration Points

The frontend expects these backend services:

1. **Intent Parser Service** - Converts natural language to SQL
2. **Database Service** - Executes queries and returns data
3. **Visualization Service** - Generates charts and maps
4. **Multilingual Service** - Handles language detection/translation

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized for mobile performance
- Progressive Web App ready

## 🌐 Deployment

The Next.js app can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 🔄 Migration Notes

- All React components converted to TypeScript
- Lucide icons replaced with SVG components
- Chart.js integration for better performance
- Leaflet maps with SSR support
- Environment-based API configuration
- Improved error handling and loading states
