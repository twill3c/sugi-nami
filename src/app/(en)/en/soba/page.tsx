import { SobaView, sobaMetadata } from "@/views/SobaView";

export const metadata = sobaMetadata("en");

export default function Page() {
  return <SobaView locale="en" />;
}
