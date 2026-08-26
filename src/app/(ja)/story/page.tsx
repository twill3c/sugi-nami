import { StoryView, storyMetadata } from "@/views/StoryView";

export const metadata = storyMetadata("ja");

export default function Page() {
  return <StoryView locale="ja" />;
}
