import { useAuthStore } from "@/state/auth";
import { Redirect } from "expo-router";

export default function Root() {
  const token = useAuthStore((s) => s.token);
  return token ? <Redirect href="/rooms" /> : <Redirect href="/login" />;
}
