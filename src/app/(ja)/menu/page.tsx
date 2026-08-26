import { MenuView, menuMetadata } from "@/views/MenuView";

export const metadata = menuMetadata("ja");

export default function Page() {
  return <MenuView locale="ja" />;
}
