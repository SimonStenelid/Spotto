import { FC } from 'react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface DocumentationPageProps {
  className?: string
}

export const DocumentationPage: FC<DocumentationPageProps> = ({
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Navigation is handled by the main layout */}
      
      {/* Main Documentation Content */}
      <main className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 hidden lg:block">
          {/* Search */}
          <div className="mb-8">
            <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search docs"
                className="bg-transparent border-none focus:outline-none text-muted-foreground w-full"
              />
            </div>
          </div>

          {/* Doc Navigation */}
          <nav className="space-y-8">
            {/* Getting Started Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-muted-foreground">GETTING STARTED</h4>
              <div className="flex flex-col space-y-3">
                <Link to="/docs/introduction" className="text-muted-foreground hover:text-foreground transition">
                  Introduction
                </Link>
                <Link to="/docs/quick-start" className="text-muted-foreground hover:text-foreground transition">
                  Quick Start Guide
                </Link>
                <div className="relative">
                  <div className="absolute left-0 top-0 w-[3px] h-6 bg-foreground" />
                  <Link to="/docs/map-navigation" className="pl-4 font-bold text-foreground">
                    Map Navigation
                  </Link>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-muted-foreground">FEATURES</h4>
              <div className="flex flex-col space-y-3">
                <Link to="/docs/location-services" className="text-muted-foreground hover:text-foreground transition">
                  Location Services
                </Link>
                <Link to="/docs/place-discovery" className="text-muted-foreground hover:text-foreground transition">
                  Place Discovery
                </Link>
                <Link to="/docs/offline-maps" className="text-muted-foreground hover:text-foreground transition">
                  Offline Maps
                </Link>
                <Link to="/docs/favorites" className="text-muted-foreground hover:text-foreground transition">
                  Favorites
                </Link>
              </div>
            </div>

            {/* Resources Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-muted-foreground">RESOURCES</h4>
              <div className="flex flex-col space-y-3">
                <Link to="/docs/faq" className="text-muted-foreground hover:text-foreground transition">
                  FAQ
                </Link>
                <Link to="/docs/community" className="text-muted-foreground hover:text-foreground transition">
                  Community
                </Link>
                <Link to="/docs/support" className="text-muted-foreground hover:text-foreground transition">
                  Support
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 max-w-3xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/docs" className="hover:text-foreground transition">
              Documentation
            </Link>
            <span>/</span>
            <Link to="/docs/getting-started" className="hover:text-foreground transition">
              Getting Started
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Map Navigation</span>
          </div>

          {/* Title Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Map Navigation</h1>
            <p className="text-lg text-muted-foreground">
              Learn how to navigate Stockholm with Spotto's minimalist map interface.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* Overview Section */}
            <section id="overview">
              <h2 className="text-2xl font-semibold mb-6">Overview</h2>
              <p className="text-muted-foreground mb-8">
                Spotto's map interface is designed to be intuitive and minimalist, focusing on what matters most: discovering great places in Stockholm. Our approach emphasizes clarity and ease of use, removing unnecessary elements to help you navigate the city effortlessly.
              </p>
              
              {/* Map Preview */}
              <div className="bg-muted rounded-xl p-6 mb-2">
                <div className="bg-foreground rounded-xl aspect-[15/7] mb-4" />
                <p className="text-sm text-center text-muted-foreground">
                  Spotto's minimalist map interface
                </p>
              </div>
            </section>

            {/* Basic Navigation Section */}
            <section id="basic-navigation">
              <h2 className="text-2xl font-semibold mb-6">Basic Navigation</h2>
              
              {/* Gestures Subsection */}
              <div id="gestures" className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Gestures</h3>
                <p className="text-muted-foreground mb-4">
                  Spotto uses standard map gestures that you're already familiar with:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-4">
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-sm bg-foreground shrink-0" />
                    <p className="text-muted-foreground">
                      Scroll for zoom features, as well as a small +/- tool in the corner.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-sm bg-foreground shrink-0" />
                    <p className="text-muted-foreground">
                      Click a marker on the map to get quick information, view more for full details
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-sm bg-foreground shrink-0" />
                    <p className="text-muted-foreground">
                      Save places as bookmarks
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-sm bg-foreground shrink-0" />
                    <p className="text-muted-foreground">
                      Search bar to find specific places by name or find places by searching for a category, eg. "bar"
                    </p>
                  </li>
                </ul>
              </div>

              {/* Location Markers Subsection */}
              <div id="location-markers">
                <h3 className="text-lg font-semibold mb-4">Location Markers</h3>
                <p className="text-muted-foreground mb-6">
                  Spotto uses a simple, consistent system of markers to help you identify different types of locations:
                </p>
                <div className="bg-muted rounded-xl p-6">
                  <div className="flex justify-around">
                    {/* Your Location Marker */}
                    <div className="text-center">
                      <div className="bg-background rounded-full p-3 w-12 h-12 mx-auto mb-3">
                        <div className="bg-foreground rounded-xl w-8 h-8" />
                      </div>
                      <span className="text-sm text-muted-foreground">Your Location</span>
                    </div>

                    {/* Saved Place Marker */}
                    <div className="text-center">
                      <div className="bg-foreground rounded-full p-3 w-12 h-12 mx-auto mb-3">
                        <HeartIcon className="w-6 h-6 text-background" />
                      </div>
                      <span className="text-sm text-muted-foreground">Saved Place</span>
                    </div>

                    {/* Restaurant Marker */}
                    <div className="text-center">
                      <div className="bg-[#1a1a1a] border border-background rounded-full p-3 w-12 h-12 mx-auto mb-3">
                        <UtensilsIcon className="w-6 h-6 text-background" />
                      </div>
                      <span className="text-sm text-muted-foreground">Restaurant</span>
                    </div>

                    {/* Attraction Marker */}
                    <div className="text-center">
                      <div className="bg-[#1a1a1a] border border-background rounded-full p-3 w-12 h-12 mx-auto mb-3">
                        <LandmarkIcon className="w-6 h-6 text-background" />
                      </div>
                      <span className="text-sm text-muted-foreground">Attraction</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced Features Section */}
            <section id="advanced-features">
              <h2 className="text-2xl font-semibold mb-6">Advanced Features</h2>
              
              {/* Code Example */}
              <div className="bg-muted rounded-xl overflow-hidden mb-4">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Using the Spotto API to access map data
                  </span>
                  <span className="text-sm text-muted-foreground">JavaScript</span>
                </div>
                <div className="bg-foreground text-background p-6 font-mono text-sm">
                  <pre>{`const map = new SpottoMap({
  center: [59.3293, 18.0686], // Stockholm coordinates
  zoom: 13
});

// Add user's location
map.addUserLocation();

// Find nearby restaurants
const restaurants = await map.findNearby('restaurant', {
  radius: 1000 // meters
});

// Display results on map
restaurants.forEach(place => {
  map.addMarker(place.coordinates, {
    type: 'restaurant',
    title: place.name
  });
});`}</pre>
                </div>
              </div>
              <p className="text-muted-foreground">
                The example above demonstrates how to initialize a map centered on Stockholm, add the user's current location, and display nearby restaurants using the Spotto API.
              </p>
            </section>

            {/* Best Practices Section */}
            <section id="best-practices">
              <h2 className="text-2xl font-semibold mb-6">Best Practices</h2>
              
              <div className="space-y-4">
                {/* Enable Location Services Tip */}
                <div className="bg-[#f9f9f9] rounded-xl p-6">
                  <div className="flex gap-6">
                    <div className="bg-foreground rounded-full w-10 h-10 shrink-0 flex items-center justify-center">
                      <LocationIcon className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Enable Location Services</h3>
                      <p className="text-muted-foreground">
                        For the best experience, make sure to enable location services when prompted. This allows Spotto to show your current position and provide accurate directions to places of interest.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Offline Maps Tip */}
                <div className="bg-[#f9f9f9] rounded-xl p-6">
                  <div className="flex gap-6">
                    <div className="bg-foreground rounded-full w-10 h-10 shrink-0 flex items-center justify-center">
                      <DownloadIcon className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Download Offline Maps</h3>
                      <p className="text-muted-foreground">
                        Premium users can download maps for offline use. This is especially useful when traveling in areas with limited connectivity or to avoid using mobile data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation Links */}
            <div className="flex justify-between items-center pt-8 mt-16 border-t">
              <Link 
                to="/docs/installation"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span>Installation</span>
              </Link>
              <Link 
                to="/docs/location-services"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
              >
                <span>Location Services</span>
                <ChevronRightIcon className="w-5 h-5" />
              </Link>
            </div>

            {/* Feedback Section */}
            <div className="bg-muted rounded-xl p-6 mt-8 text-center">
              <h3 className="text-muted-foreground font-medium mb-4">
                Was this documentation helpful?
              </h3>
              <div className="flex justify-center gap-4">
                <button className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-medium hover:bg-foreground/90 transition">
                  Yes
                </button>
                <button className="bg-background border border-border rounded-full px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition">
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents Sidebar */}
        <aside className="w-[200px] shrink-0 hidden xl:block">
          <div className="sticky top-8">
            <h4 className="text-sm font-bold text-muted-foreground mb-4">ON THIS PAGE</h4>
            <nav className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-[2px] h-5 bg-foreground" />
                <Link to="#overview" className="text-sm font-medium text-foreground">
                  Overview
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[2px] h-5 bg-transparent" />
                <Link to="#basic-navigation" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Basic Navigation
                </Link>
              </div>
              <div className="pl-4">
                <Link to="#gestures" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Gestures
                </Link>
              </div>
              <div className="pl-4">
                <Link to="#location-markers" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Location Markers
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[2px] h-5 bg-transparent" />
                <Link to="#advanced-features" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Advanced Features
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[2px] h-5 bg-transparent" />
                <Link to="#best-practices" className="text-sm text-muted-foreground hover:text-foreground transition">
                  Best Practices
                </Link>
              </div>
            </nav>

            {/* Edit Link */}
            <div className="mt-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
              <EditIcon className="w-4 h-4" />
              <Link to="/edit" className="text-sm font-medium">
                Edit this page
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

// Icons
const SearchIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const EditIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
)

const HeartIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const UtensilsIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
)

const LandmarkIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </svg>
)

// Add new icons at the bottom
const LocationIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const DownloadIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const ChevronLeftIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRightIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
) 