"use client";

import { useState } from "react";
import { useJumbo } from "@/store/jumbo";
import { AppShell } from "@/components/jumbo/app-shell";

export default function DriverPage() {
  useState(() => {
    useJumbo.getState().setMode("driver");
  });

  return (
    <div className="h-dvh w-full overflow-hidden bg-white">
      <AppShell />
    </div>
  );
}