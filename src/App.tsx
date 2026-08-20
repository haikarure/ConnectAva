import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LangProvider } from "@/lib/i18n";
import { useLang } from "@/lib/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import LiveKitWidget from "@/components/ai_avatar/LiveKitWidget";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

import Index from "./pages/Index";
import DaybedsSuites from "./pages/DaybedsSuites";
import Dining from "./pages/Dining";
import Experiences from "./pages/Experiences";
import WeddingsMice from "./pages/WeddingsMice";
import Events from "./pages/Events";
import Merch from "./pages/Merch";
import LiveWeather from "./pages/LiveWeather";
import Contact from "./pages/Contact";
import NYE from "./pages/NYE";
import Faq from "./pages/Faq";
import Careers from "./pages/Careers";
import SpaWellness from "./pages/SpaWellness";
import FitnessCenter from "./pages/FitnessCenter";
import ValetParking from "./pages/ValetParking";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import StaffCheckIn from "./pages/StaffCheckIn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const FloatingConcierge = ({ onOpen }: { onOpen: () => void }) => {
  const { tf } = useLang();
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        variant="luxury"
        size="lg"
        onClick={onOpen}
        className="rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-3 px-6 py-4 gold-gradient text-[hsl(222_47%_8%)] font-bold border border-amber-300/40"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-200" />
        </span>
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold tracking-wide text-xs sm:text-sm">
          {tf({ id: "Ngobrol sama Sarah", en: "Talk to Sarah", ru: "Поговорить с Сарой", ko: "사라와 대화하기" })}
        </span>
      </Button>
    </div>
  );
};

const GlobalLayout = () => {
  const [showSupport, setShowSupport] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const open = () => setShowSupport(true);
    window.addEventListener("open-sarah", open as EventListener);
    return () => window.removeEventListener("open-sarah", open as EventListener);
  }, []);

  // Scroll to hash target on route/hash change (React Router v6 doesn't auto-scroll)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // wait a frame for the target page to mount
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      return () => clearTimeout(t);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-[hsl(222_47%_6%)]">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/daybeds-suites" element={<DaybedsSuites />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/spa-wellness" element={<SpaWellness />} />
          <Route path="/fitness-center" element={<FitnessCenter />} />
          <Route path="/weddings-mice" element={<WeddingsMice />} />
          <Route path="/events" element={<Events />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/live-weather" element={<LiveWeather />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/nye" element={<NYE />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/valet-parking" element={<ValetParking />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/bookingconfirmation" element={<BookingConfirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/staff-checkin" element={<StaffCheckIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <FloatingConcierge onOpen={() => setShowSupport(true)} />

      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 pointer-events-none">
          <div className="pointer-events-auto">
            <LiveKitWidget setShowSupport={setShowSupport} />
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LangProvider>
          <GlobalLayout />
        </LangProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
