import { MenuView, menuMetadata } from "@/views/MenuView";

export const metadata = menuMetadata("en");

export default function Page() {
  return <MenuView locale="en" />;
}
