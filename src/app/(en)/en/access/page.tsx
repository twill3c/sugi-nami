import { AccessView, accessMetadata } from "@/views/AccessView";

export const metadata = accessMetadata("en");

export default function Page() {
  return <AccessView locale="en" />;
}
