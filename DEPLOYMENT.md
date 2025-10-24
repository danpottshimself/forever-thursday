# Vercel Deployment Guide

## Quick Deploy Options

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
npm run deploy
```

### Option 2: Vercel Dashboard

1. **Push to Git**: Push your code to GitHub, GitLab, or Bitbucket
2. **Go to Vercel**: Visit [vercel.com](https://vercel.com)
3. **Import Project**: Click "New Project" and import your repository
4. **Auto-configure**: Vercel will detect Next.js automatically
5. **Deploy**: Click "Deploy"

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/forever-thursday)

## Build Verification

Before deploying, verify the build works locally:

```bash
npm run build
npm run start
```

## Environment Variables

If you need environment variables in production:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add any required variables

## Custom Domain

To add a custom domain:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your domain and follow DNS instructions

## Performance Optimization

The project is already optimized for Vercel with:

- ✅ Static generation for all pages
- ✅ Optimized images with Next.js Image component
- ✅ Compressed assets
- ✅ Minimal bundle size
- ✅ SEO-friendly structure

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure TypeScript types are correct
- Run `npm run lint` to check for issues

### Deployment Issues
- Verify `next.config.js` is correct
- Check that all files are committed to git
- Ensure Vercel CLI is up to date

### Performance Issues
- Check image optimization settings
- Verify static generation is working
- Monitor bundle size in Vercel dashboard

## Support

For deployment issues:
- Check Vercel documentation: https://vercel.com/docs
- Contact: danpottshimself@gmail.com
