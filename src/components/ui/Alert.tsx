"use client";

import React from "react";

export default function Alert({
  intent = "info",
  children,
  role = "status",
}: Readonly<{
  intent?: "success" | "error" | "info" | "warning";
  children: React.ReactNode;
  role?: "status" | "alert";
}>) {
  const styles = {
    success: "border-green-700 bg-green-950 text-green-200",
    error: "border-red-700 bg-red-950 text-red-200",
    info: "border-blue-700 bg-blue-950 text-blue-200",
    warning: "border-yellow-700 bg-yellow-950 text-yellow-100",
  }[intent];

  return (
    <div role={role} className={`rounded border p-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
