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

const SCREENS_WITH_BOTTOM_NAV = ["home", "jobs", "notifications", "profile"] as const;

export function AppShell() {
  const screen = useJumbo((s) => s.screen);
  const showBottomNav = (
    SCREENS_WITH_BOTTOM_NAV as readonly string[]
  ).includes(screen);

  // Scroll to top whenever screen changes
  useEffect(() => {
    const el = document.getElementById("jumbo-scroll");
    if (el) el.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

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

      {showBottomNav && <BottomNav />}
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
    default:
      return <HomeScreen />;
  }
}
