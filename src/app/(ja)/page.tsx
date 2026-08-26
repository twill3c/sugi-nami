import { HomeView, homeMetadata } from "@/views/HomeView";

export const metadata = homeMetadata("ja");

export default function Page() {
  return <HomeView locale="ja" />;
}
