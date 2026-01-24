# FastFind360 - Government Property Intelligence Platform

A comprehensive GovTech SaaS platform for Nigerian state governments to detect unregistered properties using satellite imagery and AI, built with Next.js 16, React 19, and Mapbox GL JS.

## Features

### Public Website
- **Hero Section** with animated statistics and satellite imagery
- **Problem & Solution** sections highlighting revenue leakage challenges
- **Features Grid** showcasing platform capabilities
- **Case Study** from Gombe State with real data
- **Pricing Plans** for state governments
- **Contact Form** for demo requests

### Government Dashboard (Protected)
- **Overview** - Key metrics, charts, and recent activity
- **Property Map** - Interactive Mapbox map with 245k+ buildings
  - Heatmap view when zoomed out
  - Individual building markers when zoomed in
  - Filter by classification, size, and confidence
  - Click buildings to view details and reclassify
- **Analytics** - Revenue comparison, density heatmap, commercial analysis
- **Reports** - Customizable report generator with multiple templates

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2 with Server Components
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Maps**: Mapbox GL JS
- **Data Fetching**: SWR for client-side caching
- **Authentication**: Custom email/password auth
- **API**: Route handlers for data fetching and AI classification

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Mapbox API token (already configured)
- Building Classifier API endpoint (already configured)

### Installation

1. Clone the repository or download the project

2. Install dependencies:
```bash
npm install
```

3. Create environment variables (optional - defaults are already set):
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

Login at `/login` with:
- **Email**: `admin@gombegis.org`
- **Password**: `demo123`

Or any email ending in `@gov.ng` with any password for testing.

## Data Integration

### Building Data
- **Source**: Firebase Storage CSV (245,254 buildings from Gombe State)
- **Endpoint**: `/api/buildings` (server-side proxy to avoid CORS)
- **Classification**: Automatic based on area thresholds
  - Residential: < 150m²
  - Commercial: 150-600m²
  - Industrial: > 600m²

### AI Classifier
- **Endpoint**: `/api/classify` (proxies to Google Cloud Run)
- **URL**: `https://building-classifier-service-480235407496.us-central1.run.app/predict`
- **Usage**: Click "Reclassify" button in property modal

### Mapbox
- **Token**: `pk.eyJ1IjoibW10dWt1ciIsImEiOiJjbWhveXFmaGQwZHpwMmxwZ3QxeGhzb2dmIn0.EgXZbVsN1wsiYH4jfxc63Q`
- **Styles**: Satellite and Streets views
- **Features**: Heatmap, clustering, individual markers

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── buildings/route.ts      # Fetches and processes CSV data
│   │   └── classify/route.ts       # Proxies AI classification requests
│   ├── dashboard/
│   │   ├── layout.tsx              # Protected dashboard layout with sidebar
│   │   ├── page.tsx                # Overview page
│   │   ├── map/page.tsx            # Interactive property map
│   │   ├── analytics/page.tsx      # Revenue and density analytics
│   │   └── reports/page.tsx        # Report generator
│   ├── login/page.tsx              # Authentication page
│   ├── layout.tsx                  # Root layout with fonts
│   ├── globals.css                 # Tailwind CSS v4 with design tokens
│   └── page.tsx                    # Public homepage
├── components/
│   ├── dashboard/                  # Dashboard-specific components
│   │   ├── sidebar.tsx             # Navigation sidebar
│   │   ├── map/                    # Map-related components
│   │   ├── analytics/              # Analytics charts
│   │   └── reports/                # Report generation
│   ├── auth/                       # Authentication components
│   ├── ui/                         # shadcn/ui components
│   └── *.tsx                       # Homepage sections
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── buildings-data.ts           # Utility functions
│   └── auth.ts                     # Authentication utilities
└── hooks/
    └── use-buildings.ts            # SWR hook for building data
```

## Design System

### Colors
- **Primary**: Deep Blue #1E3A5F (government trust)
- **Secondary**: Satellite Blue #2563EB (satellite tech)
- **Accent**: Revenue Green #059669 (money/growth)

### Typography
- **Font**: Inter (via next/font/google)
- **Weights**: 400, 500, 600, 700

## API Routes

### GET /api/buildings
Fetches building data from Firebase CSV, parses, classifies, and returns:
```json
{
  "buildings": [...],
  "stats": {
    "total": 245264,
    "residential": 216542,
    "commercial": 26893,
    "industrial": 1829,
    "totalArea": 45892143,
    "revenuePotential": 534721890000,
    "largeCommercial": 3421
  }
}
```

### POST /api/classify
Forwards classification request to AI service:
```json
{
  "area": 250,
  "latitude": 10.2897,
  "longitude": 11.1672,
  "confidence": 0.95
}
```

## Deployment

### Vercel (Recommended)
1. Click "Publish" in v0 to deploy directly
2. Set environment variables in Vercel dashboard (optional)
3. Done! Your app is live

### Other Platforms
1. Build the project: `npm run build`
2. Start the server: `npm start`
3. Configure environment variables on your platform

## Features Checklist

- [x] Public homepage with all sections
- [x] Government dashboard with authentication
- [x] Real-time building data from Firebase (245k+ records)
- [x] Interactive Mapbox map with heatmap and markers
- [x] Property filtering and search
- [x] AI-powered reclassification
- [x] Revenue analytics and charts
- [x] Customizable report generator
- [x] Responsive design (mobile-friendly)
- [x] Professional B2G design system

## Support

For questions or issues:
- Email: support@fastfind360.com
- Company: Zippatek Digital Ltd
- Location: Abuja, Nigeria

## License

Proprietary - © 2026 Zippatek Digital Ltd
```

```json file="" isHidden
