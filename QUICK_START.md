# 🚀 Quick Start Guide

## Get Your Next.js Frontend Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy the environment template
cp env.example .env.local

# Edit .env.local and update your backend URL
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
```

### 3. Start Development Server
```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## 🔧 Backend Integration

The frontend is ready to connect to your FastAPI backend. Update the API calls in `lib/api/botService.ts` to use your actual endpoints:

- `POST /api/parse-query` - Intent parsing
- `POST /api/execute-sql` - Database queries  
- `POST /api/generate-visualization` - Charts/maps
- `GET /api/districts` - District data

## 📱 Features

- ✅ Conversational AI interface
- ✅ Data visualization (charts & maps)
- ✅ Dark/light mode toggle
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Backend API integration ready

## 🎯 Next Steps

1. **Test the app**: Open `http://localhost:3000`
2. **Connect backend**: Update API URLs in `.env.local`
3. **Deploy**: Use Vercel, Netlify, or your preferred platform

## 📚 Documentation

- [Migration Guide](MIGRATION_GUIDE.md) - Detailed migration information
- [README](README.md) - Full project documentation
