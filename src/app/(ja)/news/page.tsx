import { NewsView, newsMetadata } from "@/views/NewsView";

export const metadata = newsMetadata("ja");

export default function Page() {
  return <NewsView locale="ja" />;
}
