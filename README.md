# Community Student Marketplace

A modern marketplace platform for students to buy, sell, and share school items (books, uniforms, notes) with their community.

## Features

- 🎨 Modern, responsive UI with dark mode support
- 🔍 Advanced filtering (category, price, location, school)
- 📱 Mobile-friendly design
- ⚡ Fast search functionality
- 🎯 Real-time filtering

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React (icons)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── FilterSidebar.jsx
│   │   └── FilterDrawer.jsx
│   ├── data/
│   │   └── mockItems.js     # Mock data
│   └── App.jsx             # Main app component
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Frontend (S3 + CloudFront)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Upload `dist/` folder to S3 bucket
3. Configure CloudFront distribution

## License

Private project
