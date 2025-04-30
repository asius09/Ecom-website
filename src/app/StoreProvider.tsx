"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { makeStore } from "@/lib/store/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<{
    store: ReturnType<typeof makeStore>["store"];
    persistor: ReturnType<typeof makeStore>["persistor"];
  } | null>(null);

  if (!storeRef.current) {
    const { store, persistor } = makeStore();
    storeRef.current = { store, persistor };
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate persistor={storeRef.current.persistor} loading={null}>
        {children}
      </PersistGate>
    </Provider>
  );
}
