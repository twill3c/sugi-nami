import { SobaView, sobaMetadata } from "@/views/SobaView";

export const metadata = sobaMetadata("ja");

export default function Page() {
  return <SobaView locale="ja" />;
}
