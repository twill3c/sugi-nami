import { AccessView, accessMetadata } from "@/views/AccessView";

export const metadata = accessMetadata("ja");

export default function Page() {
  return <AccessView locale="ja" />;
}
