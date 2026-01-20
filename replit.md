# WebWaka Suite - Tenant Dashboard

## Overview
A React-based dashboard interface for the WebWaka platform tenant management suite.

## Project Structure
```
.
├── src/
│   ├── main.jsx      # React entry point
│   ├── App.jsx       # Main dashboard component
│   └── index.css     # Global styles
├── index.html        # HTML entry point
├── vite.config.js    # Vite configuration
└── package.json      # Node.js dependencies
```

## Tech Stack
- React 19
- Vite 7 (dev server and build tool)

## Running the Application
```bash
npm run dev
```
The dev server runs on port 5000.

## Building for Production
```bash
npm run build
```
Output is placed in the `dist` folder.

## Configuration
- Vite is configured to allow all hosts for Replit's proxy environment
- Dev server binds to 0.0.0.0:5000 for proper Replit integration

## Recent Changes
- January 20, 2026: Initial dashboard implementation with React and Vite
