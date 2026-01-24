# FastFind360 Deployment Guide

This guide will help you deploy FastFind360 to production.

## Pre-Deployment Checklist

- [x] All 245,254 building records loading from Firebase
- [x] Mapbox map rendering correctly
- [x] AI Classifier API endpoint configured
- [x] Authentication working
- [x] All dashboard pages functional
- [x] Reports generation working
- [x] Mobile responsive design tested

## Quick Deploy to Vercel

### Option 1: Deploy from v0 (Recommended)

1. Click the **"Publish"** button in the top-right corner of v0
2. Connect your Vercel account if not already connected
3. Choose a project name (e.g., `fastfind360-gombe`)
4. Click **"Deploy"**
5. Wait 2-3 minutes for deployment
6. Your app is live! 🎉

### Option 2: Deploy via GitHub

1. Click the three dots menu in v0
2. Select **"Push to GitHub"**
3. Create a new repository or select existing
4. Go to [vercel.com/new](https://vercel.com/new)
5. Import your GitHub repository
6. Click **"Deploy"**

## Environment Variables (Optional)

These are already set with default values in the code, but you can override them:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoibW10dWt1ciIsImEiOiJjbWhveXFmaGQwZHpwMmxwZ3QxeGhzb2dmIn0.EgXZbVsN1wsiYH4jfxc63Q
```

To add in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the variable
4. Redeploy the project

## Post-Deployment Verification

Visit your deployed URL and test:

1. **Homepage** - Check all sections load
2. **Login** - Use `admin@gombegis.org` / `demo123`
3. **Dashboard Overview** - Verify 245k+ buildings loaded
4. **Property Map** - Test Mapbox rendering and interactions
5. **Analytics** - Check all charts display correctly
6. **Reports** - Generate a test report

## Custom Domain Setup

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `fastfind360.gov.ng`)
4. Follow Vercel's DNS instructions
5. SSL certificate will be automatically provisioned

## Performance Optimization

The app is already optimized with:
- Server-side data fetching for initial load
- SWR client-side caching (60s deduping)
- API route caching (1 hour)
- Code splitting and lazy loading
- Image optimization via Next.js

## Monitoring

### Built-in Vercel Analytics
- Automatically enabled for all deployments
- View in Vercel dashboard under "Analytics"

### Error Tracking
- Check "Logs" tab in Vercel dashboard
- Server logs show data fetch status
- Client errors visible in browser console

## Scaling Considerations

### Current Limits
- **Buildings**: 245,254 (Gombe State)
- **Map rendering**: Up to 100,000 points
- **API caching**: 1 hour

### For Multiple States
1. Update API to accept state parameter
2. Create separate CSV files per state
3. Implement state selector in dashboard
4. Scale Firebase storage accordingly

## Troubleshooting

### Map not loading
- Check Mapbox token is valid
- Verify `mapbox-gl` CSS is imported
- Check browser console for errors

### Buildings not loading
- Verify Firebase CSV URL is accessible
- Check `/api/buildings` endpoint in Network tab
- Review server logs in Vercel

### Authentication issues
- Confirm login logic in `lib/auth.ts`
- Check localStorage is available
- Verify protected routes redirect correctly

### Classifier API failing
- Check Cloud Run endpoint is accessible
- Verify request format matches API spec
- Review `/api/classify` logs

## Support

For deployment issues:
- Email: support@fastfind360.com
- Company: Zippatek Digital Ltd
- RC: 8527315

## Production URLs

- **Main App**: `https://your-project.vercel.app`
- **Dashboard**: `https://your-project.vercel.app/dashboard`
- **Login**: `https://your-project.vercel.app/login`

## Security Notes

- Authentication is demo-only (accepts any @gov.ng email)
- For production, implement proper JWT/session management
- Consider adding rate limiting to API routes
- Add CORS restrictions if needed
- Implement proper error logging service

## Next Steps

1. Deploy to Vercel
2. Test all functionality
3. Set up custom domain
4. Configure production authentication
5. Add real government users
6. Train staff on platform usage
7. Begin property tax recovery! 💰
