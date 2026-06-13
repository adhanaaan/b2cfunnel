import type { Metadata } from "next";
import { PartyGame } from "@/components/party/PartyGame";

export const metadata: Metadata = {
  title: "Reaction Time Party 🍻",
  description: "Sober vs after-drinks reaction-time showdown.",
};

export default function PartyPage() {
  return <PartyGame />;
}
