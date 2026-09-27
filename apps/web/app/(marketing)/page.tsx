import type { Metadata } from "next";
import { HomeView } from "@/views/home/home-view";

export const metadata: Metadata = { title: "Tickora" };

export default function Home() {
  return <HomeView />;
}
