"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserProfile } from "./UserProfile";
import {
  HomeIcon,
  BookmarkIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useLocation, Link } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import { useAuthStore } from "@/store/useAuthStore";

// Create a context for the navigation state
export const NavigationContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

interface NavigationItem {
  name: string;
  href: string;
  icon: typeof HomeIcon;
  requiresAuth?: boolean;
}

const navigationItems: NavigationItem[] = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Bookmarks", href: "/bookmarks", icon: BookmarkIcon, requiresAuth: true },
  { name: "Account", href: "/profile", icon: UserCircleIcon, requiresAuth: true },
];

export function Navigation() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { authState } = useAuthStore();

  const filteredNavItems = navigationItems.filter(item => 
    !item.requiresAuth || authState === 'SIGNED_IN'
  );

  return (
    <NavigationContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className={cn(
        "flex h-screen flex-col bg-white shadow-lg relative transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* User Profile Section */}
        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "p-2" : "p-6"
        )}>
          <UserProfile isCollapsed={isCollapsed} />
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            <div className={cn(
              "text-sm font-medium text-gray-500 mb-4",
              isCollapsed ? "text-center" : "px-4"
            )}>
              {!isCollapsed && "MENU"}
            </div>
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block"
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-x-3 text-base font-normal",
                      isActive ? "bg-gray-100" : "hover:bg-gray-50",
                      isCollapsed ? "justify-center px-2" : "px-4"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </NavigationContext.Provider>
  );
} 