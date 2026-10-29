import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import EventPage from "@/pages/EventPage";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import Services from "@/pages/Services";
import Book from "@/pages/Book";
import SignIn from "@/pages/SignIn";
import Portal from "@/pages/Portal";
import Admin from "@/pages/Admin";
import { AuthProvider } from "@/lib/auth";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <a
          href="#main"
          className="ui sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main" className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events/:slug" element={<EventPage />} />
              <Route path="/stories/*" element={<Navigate to="/" replace />} />
              <Route path="/films" element={<Navigate to="/" replace />} />
              <Route path="/services" element={<Services />} />
              <Route path="/book" element={<Book />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
