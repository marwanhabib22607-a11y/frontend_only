import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { CustomerDashboard } from "@/pages/customer/Dashboard";
import { CustomerRequests } from "@/pages/customer/Requests";
import { NewRequest } from "@/pages/customer/NewRequest";
import { CustomerRequestDetail } from "@/pages/customer/RequestDetail";
import { CustomerChat } from "@/pages/customer/Chat";
import { CustomerConversationDetail } from "@/pages/customer/ConversationDetail";
import { CustomerReviews } from "@/pages/customer/Reviews";
import { CustomerNotifications } from "@/pages/customer/Notifications";
import { ArtisanDashboard } from "@/pages/artisan/Dashboard";
import { ArtisanProfile } from "@/pages/artisan/Profile";
import { ArtisanBrowseRequests } from "@/pages/artisan/BrowseRequests";
import { ArtisanJobs } from "@/pages/artisan/Jobs";
import { ArtisanSubscription } from "@/pages/artisan/Subscription";
import { ArtisanChat } from "@/pages/artisan/Chat";
import { ArtisanConversationDetail } from "@/pages/artisan/ConversationDetail";
import { ArtisanMyOffers } from "@/pages/artisan/MyOffers";
import { ArtisanReviews } from "@/pages/artisan/Reviews";
import { ArtisanNotifications } from "@/pages/artisan/Notifications";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdminUsers } from "@/pages/admin/Users";
import { AdminArtisans } from "@/pages/admin/Artisans";
import { AdminVerifications } from "@/pages/admin/Verifications";
import { AdminRequests } from "@/pages/admin/Requests";
import { AdminOffers } from "@/pages/admin/Offers";
import { AdminPlans } from "@/pages/admin/Plans";
import { AdminSubscriptions } from "@/pages/admin/Subscriptions";
import { setBaseUrl } from "@workspace/api-client-react";

const queryClient = new QueryClient();

setBaseUrl("https://api-fixit.hostingersite.com");

const ProtectedRoute = ({ component: Component, allowedRoles }: { component: any, allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-lg">جاري التحميل...</div>;
  if (!user) return <Redirect to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Redirect to={`/${user.role}/dashboard`} />;
  }

  return <Component />;
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Customer Routes */}
      <Route path="/customer/dashboard"><ProtectedRoute component={CustomerDashboard} allowedRoles={["customer"]} /></Route>
      <Route path="/customer/requests/new"><ProtectedRoute component={NewRequest} allowedRoles={["customer"]} /></Route>
      <Route path="/customer/requests/:id"><ProtectedRoute component={CustomerRequestDetail} allowedRoles={["customer"]} /></Route>
      <Route path="/customer/requests"><ProtectedRoute component={CustomerRequests} allowedRoles={["customer"]} /></Route>
      <Route path="/customer/chat/:id"><ProtectedRoute component={CustomerConversationDetail} allowedRoles={["customer"]} /></Route>
      <Route path="/customer/chat"><ProtectedRoute component={CustomerChat} allowedRoles={["customer"]} /></Route>
      <Route path="/customer/reviews"><ProtectedRoute component={CustomerReviews} allowedRoles={["customer"]} /></Route>
      <Route path="/customer/notifications"><ProtectedRoute component={CustomerNotifications} allowedRoles={["customer"]} /></Route>

      {/* Artisan Routes */}
      <Route path="/artisan/dashboard"><ProtectedRoute component={ArtisanDashboard} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/profile"><ProtectedRoute component={ArtisanProfile} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/requests"><ProtectedRoute component={ArtisanBrowseRequests} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/jobs/:id"><ProtectedRoute component={ArtisanJobs} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/jobs"><ProtectedRoute component={ArtisanJobs} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/subscription"><ProtectedRoute component={ArtisanSubscription} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/chat/:id"><ProtectedRoute component={ArtisanConversationDetail} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/chat"><ProtectedRoute component={ArtisanChat} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/offers"><ProtectedRoute component={ArtisanMyOffers} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/reviews"><ProtectedRoute component={ArtisanReviews} allowedRoles={["artisan"]} /></Route>
      <Route path="/artisan/notifications"><ProtectedRoute component={ArtisanNotifications} allowedRoles={["artisan"]} /></Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard"><ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} /></Route>
      <Route path="/admin/users"><ProtectedRoute component={AdminUsers} allowedRoles={["admin"]} /></Route>
      <Route path="/admin/artisans"><ProtectedRoute component={AdminArtisans} allowedRoles={["admin"]} /></Route>
      <Route path="/admin/verifications"><ProtectedRoute component={AdminVerifications} allowedRoles={["admin"]} /></Route>
      <Route path="/admin/requests"><ProtectedRoute component={AdminRequests} allowedRoles={["admin"]} /></Route>
      <Route path="/admin/offers"><ProtectedRoute component={AdminOffers} allowedRoles={["admin"]} /></Route>
      <Route path="/admin/plans"><ProtectedRoute component={AdminPlans} allowedRoles={["admin"]} /></Route>
      <Route path="/admin/subscriptions"><ProtectedRoute component={AdminSubscriptions} allowedRoles={["admin"]} /></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
