# Migration Guide: React to Next.js

## 🎯 Overview

This guide documents the migration of the Ripple Effect frontend from Create React App to Next.js 14 with TypeScript.

## 📋 Migration Checklist

### ✅ Completed Tasks

1. **Project Structure Migration**
   - [x] Created Next.js 14 project structure
   - [x] Set up App Router architecture
   - [x] Configured TypeScript support
   - [x] Set up Tailwind CSS configuration

2. **Component Migration**
   - [x] Migrated `App.jsx` → `app/page.tsx`
   - [x] Converted all components to TypeScript
   - [x] Updated component imports and exports
   - [x] Added proper TypeScript interfaces

3. **API Integration**
   - [x] Created API service layer in `lib/api/`
   - [x] Set up environment configuration
   - [x] Prepared backend integration points
   - [x] Added error handling and loading states

4. **Dependencies & Configuration**
   - [x] Updated `package.json` with Next.js dependencies
   - [x] Added Chart.js and React-ChartJS-2
   - [x] Integrated Leaflet for maps
   - [x] Configured TypeScript and ESLint

### 🔄 Key Changes Made

#### 1. Project Structure
```
Before (React):
src/
├── App.jsx
├── index.js
├── components/
└── api/

After (Next.js):
app/
├── layout.tsx
├── page.tsx
├── globals.css
components/
lib/
└── api/
```

#### 2. Component Updates
- **Message Component**: Added TypeScript interfaces, improved dark mode support
- **Chart Component**: Migrated from Chart.js vanilla to React-ChartJS-2
- **Map Component**: Added SSR support with dynamic imports
- **Visual Data Modal**: Enhanced with TypeScript and better error handling

#### 3. API Integration
- **Bot Service**: Prepared for backend integration with mock data fallback
- **Data API**: Created comprehensive API service layer
- **Environment Config**: Set up for easy backend URL configuration

#### 4. Performance Improvements
- **SSR/SSG**: Next.js App Router for better performance
- **Dynamic Imports**: Maps load only when needed
- **TypeScript**: Better development experience and type safety
- **Optimized Bundle**: Smaller bundle size with Next.js optimizations

## 🚀 Next Steps

### 1. Install Dependencies
```bash
cd ripple-next
npm install
```

### 2. Set Up Environment
```bash
cp env.example .env.local
# Edit .env.local with your backend URL
```

### 3. Start Development
```bash
npm run dev
```

### 4. Backend Integration
Update the API calls in `lib/api/botService.ts` to connect to your actual backend:

```typescript
// Replace mock implementation with real API calls
export const getBotResponse = async (message: string) => {
  const response = await parseQuery(message, 'en')
  const data = await executeSQL(response.sql)
  const visualization = await generateVisualization(data, 'chart')
  
  return {
    id: Date.now(),
    sender: 'bot',
    text: response.explanation,
    type: visualization.type,
    data: visualization.data
  }
}
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000

# Development mode
NODE_ENV=development
```

### Backend API Endpoints Expected
- `POST /api/parse-query` - Intent parsing
- `POST /api/execute-sql` - Database queries
- `POST /api/generate-visualization` - Chart generation
- `GET /api/districts` - District data
- `GET /api/trends` - Historical data
- `GET /api/heatmap` - Map data

## 🎨 UI/UX Improvements

1. **Better Performance**: Next.js optimizations
2. **Type Safety**: Full TypeScript support
3. **Responsive Design**: Enhanced mobile support
4. **Dark Mode**: Improved theme switching
5. **Loading States**: Better user feedback
6. **Error Handling**: Graceful error management

## 🧪 Testing

1. **Development Testing**:
   ```bash
   npm run dev
   # Test all features in browser
   ```

2. **Build Testing**:
   ```bash
   npm run build
   npm start
   # Test production build
   ```

3. **Backend Integration Testing**:
   - Update API URLs in environment
   - Test with real backend data
   - Verify all endpoints work correctly

## 📱 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- Any Node.js hosting

## 🔍 Troubleshooting

### Common Issues

1. **Map Not Loading**: Ensure Leaflet CSS is imported
2. **Charts Not Rendering**: Check Chart.js configuration
3. **API Errors**: Verify backend URL and CORS settings
4. **Build Errors**: Check TypeScript types and imports

### Debug Steps

1. Check browser console for errors
2. Verify environment variables
3. Test API endpoints directly
4. Check network requests in DevTools

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript with Next.js](https://nextjs.org/docs/basic-features/typescript)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
