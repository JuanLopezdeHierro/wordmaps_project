# WordMaps Frontend

React 18 + Vite single-page application for interactive word graph exploration.

## Technology Stack

- **React 18.3.1** with Hooks
- **Vite 7.3.0** for fast builds and HMR
- **TailwindCSS 3.4.1** for styling
- **Axios** for API communication

## Local Development

### Prerequisites
- Node.js 18+ and npm

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Application runs on `http://localhost:5173` with hot module replacement.

### Environment Variables

Create `.env.local` for local development:
```env
VITE_API_URL=http://localhost:8080/api
```

For production (already configured):
```javascript
const API_URL = 'https://e23y9088lc.execute-api.us-east-1.amazonaws.com/api';
```

## Build

Create production bundle:
```bash
npm run build
```

Outputs optimized assets to `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx               # React entry point
├── components/
│   └── ...                # Reusable UI components
├── services/
│   └── api.js             # API client with Axios
└── styles/
    └── index.css          # TailwindCSS global styles
```

## Features

- Interactive word search interface
- Real-time path visualization
- Graph statistics display
- Responsive design for mobile/desktop
- Error handling with user-friendly messages

## API Integration

All API calls are centralized in `src/services/api.js`:

```javascript
import { findRoute, getGraphStats } from './services/api';

// Find path between words
const route = await findRoute('CAT', 'FAT');

// Get graph statistics
const stats = await getGraphStats();
```

## Styling

Uses TailwindCSS utility classes. Configuration in `tailwind.config.js`.

Custom theme colors:
- Primary: Neon blue
- Background: Dark gray gradients
- Accent: Purple/pink

## Deployment

Deployed to AWS S3 + CloudFront. See main README for deployment instructions.

### Manual Deployment to S3
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

## Linting

```bash
npm run lint
```

Configuration in `eslint.config.js`.
