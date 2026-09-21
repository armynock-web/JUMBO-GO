"use client";

import { useEffect } from "react";
import { useJumbo } from "@/store/jumbo";
import { SplashScreen } from "./screens/splash";
import { OnboardingScreen } from "./screens/onboarding";
import { LoginScreen } from "./screens/login";
import { RegisterScreen } from "./screens/register";
import { VerifyOtpScreen } from "./screens/verify-otp";
import { HomeScreen } from "./screens/home";
import { PickupScreen } from "./screens/pickup";
import { DropoffScreen } from "./screens/dropoff";
import { VehicleTypeScreen } from "./screens/vehicle-type";
import { SummaryScreen } from "./screens/summary";
import { ConfirmScreen } from "./screens/confirm";
import { SearchingScreen } from "./screens/searching";
import { DriverFoundScreen } from "./screens/driver-found";
import { TrackingScreen } from "./screens/tracking";
import { CompletedScreen } from "./screens/completed";
import { JobsScreen } from "./screens/jobs";
import { NotificationsScreen } from "./screens/notifications";
import { ProfileScreen } from "./screens/profile";
import { SupportScreen } from "./screens/support";
import { BottomNav } from "./bottom-nav";
import { AnimatePresence, motion } from "framer-motion";

// Driver screens
import { DriverRegisterScreen } from "./screens/driver/register";
import { DriverLoginScreen } from "./screens/driver/login";
import { DriverOnboardingScreen } from "./screens/driver/onboarding";
import { DriverOnboardingStatusScreen } from "./screens/driver/status";
import { DriverDashboardScreen } from "./screens/driver/dashboard";
import { DriverJobsScreen } from "./screens/driver/jobs";
import { DriverEarningsScreen } from "./screens/driver/earnings";
import { DriverHistoryScreen } from "./screens/driver/history";
import { DriverProfileScreen } from "./screens/driver/profile";

// Admin screens
import { AdminLoginScreen } from "./screens/admin/login";
import { AdminShell, AdminDashboardContent } from "./screens/admin/shell";
import {
  AdminUsersPage,
  AdminDriversPage,
  AdminKycPage,
  AdminVehiclesPage,
  AdminJobsPage,
  AdminPricingPage,
  AdminPaymentsPage,
  AdminReportsPage,
  AdminSettingsPage,
  AdminNotificationsPage,
} from "./screens/admin/pages";

const USER_BOTTOM_NAV_SCREENS = ["home", "jobs", "notifications", "profile"] as const;

export function AppShell() {
  const screen = useJumbo((s) => s.screen);
  const mode = useJumbo((s) => s.mode);
  const isUserBottomNav =
    mode === "user" &&
    (USER_BOTTOM_NAV_SCREENS as readonly string[]).includes(screen);

  // Scroll to top whenever screen changes
  useEffect(() => {
    const el = document.getElementById("jumbo-scroll");
    if (el) el.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

  // Admin uses its own shell (with sidebar)
  if (mode === "admin" && screen !== "admin-login") {
    return (
      <AdminShell>
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderAdmin(screen)}
        </motion.div>
      </AdminShell>
    );
  }

  return (
    <div
      id="jumbo-scroll"
      className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-white scrollbar-hide"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-full"
        >
          {renderScreen(screen)}
        </motion.div>
      </AnimatePresence>

      {isUserBottomNav && <BottomNav />}
    </div>
  );
}

function renderScreen(screen: string) {
  switch (screen) {
    case "splash":
      return <SplashScreen />;
    case "onboarding":
      return <OnboardingScreen />;
    case "login":
      return <LoginScreen />;
    case "register":
      return <RegisterScreen />;
    case "verify-otp":
      return <VerifyOtpScreen />;
    case "home":
      return <HomeScreen />;
    case "pickup":
      return <PickupScreen />;
    case "dropoff":
      return <DropoffScreen />;
    case "vehicle-type":
      return <VehicleTypeScreen />;
    case "summary":
      return <SummaryScreen />;
    case "confirm":
      return <ConfirmScreen />;
    case "searching":
      return <SearchingScreen />;
    case "driver-found":
      return <DriverFoundScreen />;
    case "tracking":
      return <TrackingScreen />;
    case "completed":
      return <CompletedScreen />;
    case "jobs":
      return <JobsScreen />;
    case "notifications":
      return <NotificationsScreen />;
    case "profile":
      return <ProfileScreen />;
    case "support":
      return <SupportScreen />;
    // Driver
    case "driver-register":
      return <DriverRegisterScreen />;
    case "driver-login":
      return <DriverLoginScreen />;
    case "driver-onboarding":
      return <DriverOnboardingScreen />;
    case "driver-onboarding-status":
      return <DriverOnboardingStatusScreen />;
    case "driver-dashboard":
      return <DriverDashboardScreen />;
    case "driver-jobs":
      return <DriverJobsScreen />;
    case "driver-earnings":
      return <DriverEarningsScreen />;
    case "driver-history":
      return <DriverHistoryScreen />;
    case "driver-profile":
      return <DriverProfileScreen />;
    // Admin login
    case "admin-login":
      return <AdminLoginScreen />;
    default:
      return <HomeScreen />;
  }
}

function renderAdmin(screen: string) {
  switch (screen) {
    case "admin-dashboard":
      return <AdminDashboardContent />;
    case "admin-users":
      return <AdminUsersPage />;
    case "admin-drivers":
      return <AdminDriversPage />;
    case "admin-kyc":
      return <AdminKycPage />;
    case "admin-vehicles":
      return <AdminVehiclesPage />;
    case "admin-jobs":
      return <AdminJobsPage />;
    case "admin-pricing":
      return <AdminPricingPage />;
    case "admin-payments":
      return <AdminPaymentsPage />;
    case "admin-reports":
      return <AdminReportsPage />;
    case "admin-notifications":
      return <AdminNotificationsPage />;
    case "admin-settings":
      return <AdminSettingsPage />;
    default:
      return <AdminDashboardContent />;
  }
}
