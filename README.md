# Forever February - Emo Lifestyle Store

A modern e-commerce website for emo lifestyle products including pillow sprays, wax melts, and art prints. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Emo/Grunge Design**: Distressed, sketchy styling with black and white theme
- 🛍️ **Product Catalog**: 12+ products with detailed information
- 🛒 **Shopping Cart**: Add to cart functionality with quantity selection
- 📱 **Product Modal**: Detailed product view with quantity selector
- 📧 **Contact Form**: Email integration for customer inquiries
- 📖 **About Page**: Ethical product information and company story
- ⚡ **Performance**: Optimized images and animations
- 📱 **Responsive**: Works perfectly on all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd forever-thursday
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

### Environment Variables (if needed)

If you need environment variables for production:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add any required variables

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── products/       # Products page
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/         # React components
│   ├── Header.tsx     # Navigation header
│   ├── Footer.tsx     # Site footer
│   ├── Hero.tsx       # Landing hero section
│   ├── LogoAnimation.tsx # Animated logo
│   ├── ProductBanner.tsx # Product showcase
│   ├── ProductCard.tsx   # Individual product card
│   └── ProductModal.tsx  # Product detail modal
├── lib/               # Utility functions
│   └── data.ts       # Product data
└── types/            # TypeScript type definitions
    └── index.ts      # Type definitions
```

## Customization

### Adding Products

Edit `src/lib/data.ts` to add new products:

```typescript
{
  id: 'unique-id',
  name: 'Product Name',
  description: 'Product description',
  price: 29.99,
  image: '/images/product-image.svg',
  category: 'pillow-sprays' | 'wax-melts' | 'prints',
}
```

### Styling

The site uses Tailwind CSS with custom classes defined in `src/app/globals.css`:

- `.sketchy-font` - Hand-drawn style fonts
- `.grunge-text` - Distressed text effects
- `.emo-glow` - Glowing effects

### Contact Email

Update the contact email in `src/app/contact/page.tsx`:

```typescript
const mailtoLink = `mailto:your-email@example.com?subject=${subject}&body=${body}`
```

## License

This project is private and proprietary to Forever February.

## Support

For support or questions, contact danpottshimself@gmail.com
