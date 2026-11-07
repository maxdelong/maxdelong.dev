import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "@/components/ComingSoonPlaceholder";

export const metadata: Metadata = { title: "Spotify Tracker" };

export default function SpotifyTrackerPage() {
  return <ComingSoonPlaceholder appName="Spotify Tracker" icon="🎧" />;
}
