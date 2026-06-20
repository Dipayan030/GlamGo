import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { SalonDetailsPage } from './pages/SalonDetailsPage';
import { BookingFlow } from './pages/BookingFlow';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { VendorDashboard } from './pages/VendorDashboard';

function Router() {
  const { route } = useApp();
  switch (route.name) {
    case 'landing':
      return <LandingPage />;
    case 'search':
      return <DiscoveryPage />;
    case 'salon':
      return <SalonDetailsPage />;
    case 'checkout':
      return <BookingFlow />;
    case 'customer':
      return <CustomerDashboard />;
    case 'vendor':
      return <VendorDashboard />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}
