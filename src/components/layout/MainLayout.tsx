
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";
import { strings } from "@/data/strings.ko";
import { WarningBanner } from "@/components/compliance/WarningBanner";

// Map routes to header titles if needed, or handle headers per page
const getHeaderTitle = (pathname: string) => {
  switch (pathname) {
    case "/portfolio":
      return strings.pages.portfolioTitle;
    case "/learning-loop":
      return strings.pages.learningLoopTitle;
    case "/profile":
      return strings.nav.profile; // Using nav string as fallback for profile title
    case "/notifications":
        // Notifications might have a specific header or back button logic
        return "알림 센터"; 
    default:
      return strings.app.title;
  }
};

const MainLayout = () => {
  const location = useLocation();
  const title = getHeaderTitle(location.pathname);
  
  // Decide if we should show the header. 
  // Home page has its own specific header logic in the original code, 
  // but let's try to unify or at least provide a default.
  // For now, let's keep it simple: Show header for everyone except possibly home if Home handles it itself.
  // Looking at Home.tsx, it renders MobileHeader itself. 
  // To avoid duplication, we should probably REMOVE MobileHeader from the individual pages 
  // and manage it here, OR managing it here is safer for consistency.
  
  // Actually, for a "MainLayout", consistency is key. 
  // Let's render the BottomNav always.
  // Let's render the Outlet (page content).
  
  // Note: Home.tsx currently renders MobileHeader, CMISummary, etc.
  // If we put MobileHeader here, we need to remove it from Home.tsx, Portfolio.tsx, etc.
  // Let's start by just creating the wrapper for BottomNav and Outlet to fix the "disappearing nav" issue first.
  // We can refactor headers in a second pass or handle it per page for now to minimize breakage.
  
  // However, BottomNav needs 'active' prop in the current implementation.
  // We will update BottomNav to not need it, but for now let's modify BottomNav to handle it internally.
  
  return (
    <div className="min-h-screen bg-background pb-20">
        {/* We will leave header control to pages for now to avoid breaking custom headers (like notification count on Home) */}
        
        <Outlet />
        
        <BottomNav className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default MainLayout;
