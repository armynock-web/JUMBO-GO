"use client";

import { useEffect } from "react";
import { useJumbo } from "@/store/jumbo";
import { AppShell } from "@/components/jumbo/app-shell";

export default function AdminPage() {
  useEffect(() => {
    const store = useJumbo.getState();
    store.setMode("admin");
    if (!store.screen.startsWith("admin-") || store.screen === "admin-login") {
      store.go("admin-dashboard");
    }
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-surface">
      <AppShell />
    </div>
  );
}