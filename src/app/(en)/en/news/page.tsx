import { NewsView, newsMetadata } from "@/views/NewsView";

export const metadata = newsMetadata("en");

export default function Page() {
  return <NewsView locale="en" />;
}
