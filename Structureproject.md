# Project Structure Documentation

## Overview
This is a modern web application built with React, TypeScript, and Vite. The project appears to be a mapping application ("vibe-map") that likely integrates with Mapbox/Maplibre for mapping functionality and Supabase for backend services.

## Current Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI (various primitives)
  - Custom components
- **Mapping**: 
  - Mapbox GL
  - Maplibre GL
- **State Management**: Zustand
- **Backend/Auth**: Supabase
- **Routing**: React Router DOM
- **Animation**: Framer Motion

## Recommended Improvements

### 1. Directory Structure Optimization
Current structure should be reorganized as follows:

#### Root Directory (Recommended)
```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes group
│   ├── (dashboard)/       # Dashboard routes group
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Shared components
│   ├── ui/               # Shadcn UI components
│   ├── forms/            # Form components
│   ├── maps/             # Map-related components
│   └── layouts/          # Layout components
├── lib/                  # Utility functions
│   ├── utils/            # Helper functions
│   ├── hooks/            # Custom hooks
│   └── constants/        # Constants and configs
├── types/                # TypeScript interfaces
├── styles/               # Global styles
└── public/              # Static assets
```

### 2. Component Organization
Components should follow this structure:
```
components/
├── ui/                   # Shadcn UI components
│   ├── button/
│   │   ├── index.tsx    # Main component
│   │   └── variants.ts  # Component variants
├── forms/               # Form components
│   ├── auth/           # Authentication forms
│   └── search/         # Search-related forms
└── maps/               # Map components
    ├── controls/       # Map control components
    └── layers/         # Map layer components
```

### 3. Performance Optimizations
Add the following structure:
```
app/
├── loading.tsx          # Global loading state
├── error.tsx           # Global error boundary
└── providers/          # Client-side providers
    └── suspense-boundaries.tsx
```

## Implementation Recommendations

### 1. Code Organization
- Move from React Router to Next.js App Router for better SEO and performance
- Implement proper route grouping with Next.js conventions
- Add proper loading and error boundaries

### 2. Component Structure
- Implement Shadcn UI components in the ui/ directory
- Create proper component interfaces in types/
- Use proper naming conventions for files (kebab-case)

### 3. State Management
- Move from pure Zustand to hybrid approach:
  - Server state: Next.js Server Components
  - Client state: Zustand (minimal usage)
  - URL state: nuqs for search parameters

### 4. Performance Enhancements
- Implement React Suspense boundaries
- Add proper loading states
- Use Next.js Image component for optimized images
- Implement proper code splitting

### 5. TypeScript Improvements
- Create proper interface files
- Use mapped types instead of enums
- Implement proper type guards

## Migration Steps

1. **Initial Setup**
   - Set up Next.js App Router
   - Migrate from Vite to Next.js build system
   - Set up proper TypeScript configuration

2. **Component Migration**
   - Reorganize components following new structure
   - Implement Shadcn UI components
   - Add proper TypeScript interfaces

3. **State Management**
   - Migrate to Server Components where possible
   - Implement proper client-side state boundaries
   - Set up nuqs for URL state management

4. **Performance**
   - Add Suspense boundaries
   - Implement proper loading states
   - Set up image optimization

## Best Practices (Updated)

1. **Component Architecture**
   - Use Server Components by default
   - Add 'use client' only when necessary
   - Implement proper loading and error boundaries

2. **TypeScript Usage**
   - Use interfaces over types
   - Implement proper type guards
   - Use mapped types instead of enums

3. **Styling**
   - Use Tailwind with proper responsive design
   - Implement component variants with cva
   - Follow mobile-first approach

4. **Performance**
   - Optimize Core Web Vitals
   - Implement proper code splitting
   - Use Next.js Image component
   - Add Suspense boundaries

5. **State Management**
   - Use Server Components for data fetching
   - Minimize client-side state
   - Implement proper URL state management

## Development Guidelines

1. Follow Next.js App Router patterns
2. Use TypeScript strict mode
3. Implement proper error boundaries
4. Use proper loading states
5. Follow mobile-first responsive design
6. Implement proper SEO optimization
7. Use proper image optimization
8. Follow proper code splitting practices

## Directory Structure

### Root Directory
```
├── app/                  # Next.js app directory
├── src/                  # Main source code
├── scripts/             # Utility scripts
├── migrations/          # Database migrations
├── public/              # Static assets
└── node_modules/        # Dependencies
```

### Source Directory (src/)
```
├── api/                 # API integration layer
├── app/                 # App-specific code
├── assets/             # Static assets (images, fonts, etc.)
├── components/         # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── pages/              # Route components
├── store/              # Zustand state management
├── styles/             # Global styles and Tailwind utilities
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Key Configuration Files
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite build configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `components.json`: Shadcn/Radix UI configuration
- `postcss.config.js`: PostCSS configuration
- `eslint.config.js`: ESLint configuration

## Dependencies

### Core Dependencies
- React and React DOM (v18)
- TypeScript
- Vite
- Tailwind CSS

### UI and Components
- Radix UI primitives (various components)
- Lucide React (icons)
- Class Variance Authority
- CLSX and Tailwind Merge (utility-first styling)
- Framer Motion (animations)
- Sonner (toast notifications)

### Mapping
- Mapbox GL
- Maplibre GL

### State and Data Management
- Zustand (state management)
- Supabase (backend services)
- OpenAI (AI integration)

### Development Dependencies
- ESLint
- TypeScript
- Various type definitions (@types/*)
- PostCSS and Autoprefixer

## Development Workflow
1. Development server: `npm run dev`
2. Building: `npm run build`
3. Linting: `npm run lint`
4. Preview build: `npm run preview`

## Architecture Notes
- The project follows a modern React application structure
- Uses functional components with TypeScript
- Implements client-side routing with React Router
- Integrates mapping functionality with Mapbox/Maplibre
- Uses Supabase for backend services and authentication
- Implements state management with Zustand
- Follows a component-based architecture with Radix UI primitives
- Uses Tailwind CSS for styling with utility-first approach

## Best Practices
1. TypeScript for type safety
2. Component-based architecture
3. Modular code organization
4. Modern React patterns (hooks, functional components)
5. Utility-first styling with Tailwind
6. State management with Zustand
7. Proper separation of concerns
8. Use of environment variables for configuration
