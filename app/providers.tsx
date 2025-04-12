"use client";

import { store } from "@/lib/store";
import { Provider } from "react-redux";

export function StoreProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
