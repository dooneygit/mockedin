import type { Metadata } from "next";
import Profile from "./Profile";

export const metadata: Metadata = {
  title: {
    absolute: "MockedIn — Build & Preview a LinkedIn-Style Profile Mockup",
  },
  description:
    "Design a fully customizable, hypothetical LinkedIn-style profile mockup and preview it live. A free, independent design tool — not affiliated with LinkedIn.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <Profile />;
}
