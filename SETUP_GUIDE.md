# FastFind360 - Setup & Deployment Guide

## Environment Variables

Add these environment variables to your Vercel project (Settings > Environment Variables):

### Required Variables:
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibW10dWt1ciIsImEiOiJjbWhveXFmaGQwZHpwMmxwZ3QxeGhzb2dmIn0.EgXZbVsN1wsiYH4jfxc63Q
FIREBASE_CSV_URL=https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347
BUILDING_CLASSIFIER_API_URL=https://building-classifier-service-480235407496.us-central1.run.app/
NEXT_PUBLIC_APP_URL=https://your-deployment-url.vercel.app
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── buildings/          # Geospatial data API - fetches & processes CSV
│   │   └── classify/           # Building classifier proxy
│   ├── dashboard/              # Protected dashboard routes
│   │   ├── map/               # Interactive property map
│   │   ├── analytics/         # Revenue & density analytics
│   │   └── reports/           # Report generation
│   ├── login/                 # Authentication page
│   └── page.tsx               # Public homepage
├── components/
│   ├── dashboard/
│   │   ├── map/
│   │   │   ├── mapbox-map.tsx     # Main map with polygon rendering
│   │   │   ├── property-modal.tsx # Property details & reclassification
│   │   │   └── filter-panel.tsx   # Map filters
│   │   └── analytics/
│   └── (homepage sections)
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── buildings-data.ts       # Utility functions
│   └── auth.ts                 # Authentication logic
└── hooks/
    └── use-buildings.ts        # SWR hook for building data
```

## Key Features Implemented

### 1. Map Component (Polygon Rendering)
- **File**: `/components/dashboard/map/mapbox-map.tsx`
- Renders building footprints as polygon geometries (not points)
- 3D terrain visualization with 45° pitch
- Satellite/Streets style toggle
- Building selection with yellow highlight and fly-to animation
- Real-time filtering by classification, area, and confidence

### 2. Geospatial Data Pipeline
- **API**: `/app/api/buildings/route.ts`
- Fetches 245,254 building records from Firebase CSV
- Parses polygon geometry from WKT format
- Classifies buildings by area thresholds:
  - < 150 m² = Residential
  - 150-600 m² = Commercial
  - > 600 m² = Industrial
- Calculates estimated property values and tax revenue
- Caches results for 1 hour

### 3. Property Details Modal
- **File**: `/components/dashboard/map/property-modal.tsx`
- Shows detailed building information
- Estimated value and annual tax calculations
- AI reclassification via Google Cloud API
- CSV export functionality

### 4. Analytics Dashboard
- Revenue comparison (current vs. potential)
- Building density heatmaps by LGA
- Commercial property scatter analysis
- Revenue breakdown by local government area

### 5. Report Generation
- Executive, Technical, Revenue, and LGA-specific templates
- Customizable sections and export formats (HTML/PDF/Excel)

## Deployment Instructions

### Option 1: Vercel (Recommended)
```bash
# Install shadcn CLI
npm install -g shadcn-cli

# Clone and setup
git clone https://github.com/yourusername/fastfind360
cd fastfind360
shadcn-cli@latest init

# Deploy to Vercel
vercel deploy
```

### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Demo Credentials

**Login URL**: `http://localhost:3000/login`
- **Email**: admin@gombegis.org
- **Password**: demo123

## Data Sources

- **Buildings CSV**: Firebase Storage (245,254 records)
- **Map Tiles**: Mapbox GL JS
- **Terrain Data**: Mapbox DEM
- **AI Classifier**: Google Cloud Run service

## Features to Complete

- [ ] User management & role-based access control
- [ ] Database persistence (PostgreSQL/Supabase)
- [ ] Email notifications for new detections
- [ ] Mobile app (React Native)
- [ ] Satellite imagery integration for detection updates
- [ ] Real-time collaboration features

## Troubleshooting

### Map Not Loading
1. Check MAPBOX_TOKEN is valid in environment variables
2. Ensure buildings data is being fetched from `/api/buildings`
3. Check browser console for error messages

### Polygon Geometry Errors
1. Verify CSV has `geometry` column with WKT format
2. Check that coordinates are in [lng, lat] order (not lat, lng)

### Classification API Errors
1. Ensure Google Cloud Run service is running
2. Check BUILDING_CLASSIFIER_API_URL is correct
3. Verify request body matches expected format

## Support & Documentation

- **Mapbox GL JS**: https://docs.mapbox.com/mapbox-gl-js/
- **Next.js**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Project Repo**: https://github.com/mmtukut/gombe_planner_assist
