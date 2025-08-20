import { useAuthStore } from "@/state/auth";
import { Redirect } from "expo-router";

export default function Root() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = (useAuthStore as any).persist?.hasHydrated?.() ?? true;
  if (!hasHydrated) return null;
  return token ? <Redirect href="/(main)/(tabs)/rooms" /> : <Redirect href="/prelogin" />;
}
