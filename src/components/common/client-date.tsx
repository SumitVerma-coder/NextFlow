"use client";

import { useEffect, useState } from "react";

type ClientDateProps = {
  value: string;
};

export function ClientDate({ value }: ClientDateProps) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    setFormatted(new Date(value).toLocaleString());
  }, [value]);

  return (
    <span suppressHydrationWarning>
      {formatted || "Loading date..."}
    </span>
  );
}