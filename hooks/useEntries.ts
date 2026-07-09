"use client";

import { useState } from "react";

import type { Entry } from "@/types/profile";

export function useEntries(defaults: Entry[]) {
  const [entries, setEntries] = useState<Entry[]>(defaults);

  function add(entry: Entry) {
    setEntries((prev) => [entry, ...prev]);
  }

  function update(id: string, patch: Partial<Entry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return { entries, add, update, remove };
}
