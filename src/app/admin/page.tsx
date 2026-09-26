"use client";

import { useEffect, useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { AppShell } from "@/components/jumbo/app-shell";

export default function AdminPage() {
  const isAdminAuthenticated = useJumbo((s) => s.isAdminAuthenticated);
  const screen = useJumbo((s) => s.screen);
  const setMode = useJumbo((s) => s.setMode);
  const setAdminAuthenticated = useJumbo((s) => s.setAdminAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode("admin");
    if (typeof window !== "undefined") {
      const isAuthed = sessionStorage.getItem("jumbo_admin_auth") === "true";
      if (isAuthed) {
        setAdminAuthenticated(true);
      }
    }
    setMounted(true);
  }, [setMode, setAdminAuthenticated]);

  useEffect(() => {
    if (!mounted) return;
    const store = useJumbo.getState();
    if (!store.isAdminAuthenticated) {
      if (store.screen !== "admin-login") {
        store.go("admin-login");
      }
    } else {
      if (!store.screen.startsWith("admin-") || store.screen === "admin-login") {
        store.go("admin-dashboard");
      }
    }
  }, [mounted, isAdminAuthenticated, screen]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-surface">
      <AppShell />
    </div>
  );
}